import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import {NetworkComponent} from "./view/network/network.component";
import {TripComponent} from "./view/trip/trip.component";
import {AppRoutingModule} from "./app-routing.module";
import {FilterTripsPipe} from "./pipes/filter-trips.pipe";
import {UrlBuilderService} from "./services/url-builder.service";
import {HttpRoutingService} from "./services/http-routing.service";
import { TripDetailComponent } from './view/trip-detail/trip-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    TripComponent,
    TripDetailComponent,
    FilterTripsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [UrlBuilderService, HttpRoutingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
