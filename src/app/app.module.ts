/**
 * Created by tang on 2016/8/18.
 */

import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {routing, appRoutingProvider} from "./app.routing";
import {CraftComponent} from "./craft/craft.component";
import {HttpModule, JsonpModule} from "@angular/http";

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';
import {CraftMapreduceComponent} from "./craft/craft-mapreduce.component";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    routing,
    // InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  declarations: [
    AppComponent,
    CraftComponent,
    CraftMapreduceComponent
  ],
  providers: [
    appRoutingProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
