import { Component, OnInit } from '@angular/core';
import {DataJSON} from "../data-types";
import {DataService} from "../data.service";
import * as d3 from "d3";
import * as echarts from "echarts";
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
  providers: [
    DataService
  ]
})
export class BarComponent implements OnInit {
  dataJSON:DataJSON[];
  myChart;
  constructor(private dataService:DataService) {
    this.myChart = echarts.init(document.getElementById('main') as HTMLDivElement);
  }
  ngOnInit() {
    this.dataService.getData().then((response: DataJSON[]) => {
      this.dataJSON = response;
      this.bar()(this.dataJSON);
    }).catch(this.handleError);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  private bar() {
    return (json) => {
      console.log("bar");
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          data: ['数据平台']
        },
        xAxis: [
          {
            type: 'category',
            data: (function () {
              let data = [];
              for (let i = 0; i < json.length; i++) {
                console.log(json[i].NAME);
                data.push(json[i].NAME);
              }
              return data;
            })()
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            "name": "销量",
            "type": "bar",
            "data": (function () {
              let data = [];
              for (let i = 0; i < json.length; i++) {
                console.log(json[i].VAL);
                data.push(json[i].VAL);
              }
              return data;
            })()
          }
        ]
      };
      this.myChart.setOption(option);
    };
  }
}
