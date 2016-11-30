import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Router} from "@angular/router";
import {CraftService} from "./craft.service";
import {GlobalService} from "../global.service";

@Component({
  selector: 'app-list-experiments',
  templateUrl: 'list-experiments.component.html',
  styleUrls: ['list-experiments.component.sass']
})
export class ListExperimentsComponent implements OnInit {
  private history: [{}];

  constructor(private dataService: DataService,
              private craftService: CraftService,
              private router: Router,
              private globalService:GlobalService) {
    this.globalService.setNavpaneStat(true);
    this.dataService.getExperimentsList().then((response)=> {
      this.history = response.json();
    }).catch(()=> {
      console.warn("Get history failed.");
    });
  }

  ngOnInit() {
  }

  gotoDetail(taskName: string) {
    this.craftService.setReload(true);
    let link = ["/Experiment"];
    this.router.navigate(link);
  }
}
