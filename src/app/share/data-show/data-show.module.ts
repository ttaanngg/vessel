import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataShowComponent } from './data-show.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import {DataShowService} from "./data-show.service";
import {DataShowRoutingModule} from "./data-show.routing.module";
import {topologyComponent} from "./topology/topology.component";

@NgModule({
  imports: [
    CommonModule,
    DataShowRoutingModule
  ],
  declarations: [
    DataShowComponent,
    BarComponent,
    PieComponent,
    topologyComponent,
  ],
  providers: [
    DataShowService
  ],
  exports: [
    DataShowComponent,
    BarComponent,
    PieComponent
  ]
})
export class DataShowModule { }
