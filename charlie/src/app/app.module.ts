import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import {NetworkComponent} from './network/network.component';
import {TripComponent} from './trip/trip.component';
import {AppRoutingModule} from './app-routing.module';
import {FilterTripsPipe} from './pipes/filter-trips.pipe';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    TripComponent,
    FilterTripsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    NgbModule.forRoot()
  ],
  providers: [UrlBuilderService, HttpRoutingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
