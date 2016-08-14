import {Component, OnInit} from '@angular/core';
import {DrawboardStatusService} from "../drawboard-status.service";
import {DrawboardElement} from "./internal/drawboard.element";

@Component({
  moduleId: module.id,
  selector: 'app-drawboard',
  templateUrl: 'drawboard.component.html',
  styleUrls: ['drawboard.component.css']
})
export class DrawboardComponent implements OnInit {
  svg: any; //页面svg对象
  def: any;
  container: any;
  relationLayer: any;
  dragline: any;

  selectedLine: any;
  selectedNode: any;
  mouseDownNode: any;

  justDragged: boolean;
  dragFrom: any;
  scale: boolean;
  lastKeyDown: number;
  shiftDrag: boolean;

  constants = {
    selectedClass: "selected",
    connectClass: "connect-node",
    circleGClass: "conceptG",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13
  };

  private initState() {
    this.selectedLine = null;
    this.selectedNode = null;
    this.mouseDownNode = null;
    this.justDragged = false;
    this.dragFrom = null;
    this.scale = false;
    this.lastKeyDown = -1;
    this.shiftDrag = false;

    this.svg = d3.select("svg#dashboard");    //绑定svg
    this.def = this.svg.append("svg:def");    //绑定样式区
    this.container = this.svg.append("g");    //绑定绘图区
    this.relationLayer = this.container.append("g");  //绑定关系连线区
  }

  private initSVG() {
    this.def.append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', "32")
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    this.def.append('svg:marker')
      .attr('id', 'mark-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7)
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    this.dragline = this.container.append('svg:path')
      .attr('class', 'hidden path')
      .attr('d', 'M0,0 L0,0')
      .style('marker-end', 'url(#mark-end-arrow)');

    this.svg
      .attr("viewBox", "0 0 1000 500")
      .classed("drawboard", true);
  }

  private keyDown() {
    if (this.lastKeyDown !== -1) return;
    this.lastKeyDown = d3.event['keyCode'];
    switch (d3.event['keyCode']) {
      case this.constants.DELETE_KEY:
      case this.constants.BACKSPACE_KEY:
        (<Event> d3.event).preventDefault();
    }
  }

  private keyUp() {
    this.lastKeyDown = -1;
  }

  private bindEventHandler() {
    let self = this;

    //注册键盘事件监听
    d3.select(window)
      .on("keydown", function () {
        self.keyDown();
      })
      .on("keyup", function () {
        self.keyUp();
      });

    self.svg.on("mousedown", function () {
      let selectedNode = self.drawBoardStatus.getSelectedNode();
      if (selectedNode != null) {
        let coord = d3.mouse(self.container.node());
        //todo: 新的绘图方式
        let newElement = new DrawboardElement(self, {
          'x': coord[0],
          'y': coord[1]
        }, selectedNode);

        newElement.render();
      }

      self.drawBoardStatus.cancelSelectedNode();
    });

    self.svg.call(d3.behavior.zoom()
      .on("zoom", function () {
        self.container.attr(
          "transform",
          "translate(" + (<d3.ZoomEvent> d3.event).translate + ") scale(" + (<d3.ZoomEvent> d3.event).scale + ")");
        return true;
      })
      .on("zoomstart", function () {
        d3.select('body').style("cursor", "move");
      })
      .on("zoomend", function () {
        d3.select('body').style("cursor", "auto");
      })
    );

    //注册绘图区鼠标拖拽事件处理
    self.container.call(d3.behavior.drag()
      .on("drag", function () {
        self.justDragged = true;
        self.container.x += (<d3.DragEvent> d3.event).dx;
        self.container.y += (<d3.DragEvent> d3.event).dy;
      })
    );
  }

  constructor(private drawBoardStatus: DrawboardStatusService) {
  }

  public update() {
    this.justDragged = false;
    this.dragline.attr("d", "M0,0L0,0").classed("hidden", true);
    this.shiftDrag = false;
    this.dragFrom = null;
  }

  ngOnInit() {
    let self = this;

    self.initState();
    self.initSVG();    //初始化svg渲染和箭头图标等
    self.bindEventHandler();
  }
}