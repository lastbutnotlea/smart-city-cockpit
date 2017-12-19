import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {AppRoutingModule} from './app-routing.module';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuComponent} from './menu/menu.component';
import { TripDetailComponent } from './view/trip-detail/trip-detail.component';
import { TripEditComponent } from './view/trip-edit/trip-edit.component';
import { FilterComponent } from './view/filter/filter.component';



@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    TripComponent,
    MenuComponent,
    TripDetailComponent,
    TripEditComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    NgbModule.forRoot()
  ],
  providers: [UrlBuilderService, HttpRoutingService],
  bootstrap: [AppComponent],
  // modal dialogs:
  entryComponents: [
    TripEditComponent
  ]
})
export class AppModule { }
