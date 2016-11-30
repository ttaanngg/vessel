import { Component, OnInit } from '@angular/core';
import * as echarts from "echarts";
import * as d3 from "d3";
import {DataJSON} from "../data-types";
import {DataShowService} from "../data-show.service";

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.sass']
})
export class PieComponent implements OnInit {

  dataJSON:DataJSON[];
  myChart;
  constructor(private dataShowService:DataShowService) {
    this.myChart = echarts.init(d3.select('#main').node() as HTMLDivElement);
  }

  ngOnInit() {
    this.dataShowService.requireData().then((response: DataJSON[]) => {
      this.dataJSON = response;
      this.pie()(this.dataJSON);
    }).catch(this.handleError);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  private  pie() {
    return (json)=> {
      let app = {
        currentIndex: null,
        timeTicket: null
      };
      let option = {
        title: {
          text: '饼图高亮',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: (()=> {
            let data = [];
            for (let key in json) {
              data.push({
                name: json[key].NAME
              });
            }
            return data;
          })()
        },
        series: [

          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: (()=> {
              let data = [];
              for (let key in json)
                data.push({
                  value: json[key].VAL,
                  name: json[key].NAME
                });
              return data;
            })(),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      app.currentIndex = -1;
      app.timeTicket = setInterval(()=> {
        let dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        this.myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: app.currentIndex
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形
        this.myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: app.currentIndex
        });
        // 显示 tooltip
        this.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: app.currentIndex
        });
      }, 1000);
      if (option && typeof option === "object") {
        this.myChart.setOption(option, true);
      }
    }
  }

}