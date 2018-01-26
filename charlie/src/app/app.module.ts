import {AppComponent} from './app.component';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {MenuComponent} from './menu/menu.component';
import {TripDetailComponent} from './view/trip-detail/trip-detail.component';
import {TripEditComponent} from './view/trip-edit/trip-edit.component';
import {FilterComponent} from './shared/components/filter/filter.component';
import {MapComponent} from './view/map/map.component';
import {LineDetailComponent} from './view/line-detail/line-detail.component';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapCreatorService} from './services/map-creator.service';
import {NgModule} from '@angular/core';
import {LineMapComponent} from './view/line-map/line-map.component';
import {DropdownComponent} from './shared/components/dropdown/dropdown.component';
import {EmbeddedLineComponent} from './shared/components/embedded-line/embedded-line.component';
import {EmbeddedVehicleComponent} from './shared/components/embedded-vehicle/embedded-vehicle.component';
import {ConfirmDeletionComponent} from './shared/components/confirm-popup/confirm-deletion.component';
import {StopSortService} from './services/stop-sort.service';
import {TripEditDepartureComponent} from './view/trip-edit-departure/trip-edit-departure.component';
import {DateParserService} from './services/date-parser.service';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {TickerComponent} from './view/ticker/ticker-main/ticker.component';
import {TickerItemComponent} from './view/ticker/ticker-item/ticker-item.component';
import {StopDetailComponent} from './view/stop-detail/stop-detail.component';
import {TripAddComponent} from './view/trip-add/trip-add.component';
import {VehiclesComponent} from './view/vehicles/vehicles.component';
import {ServiceRequestsComponent} from './view/service-requests/service-requests.component';
import {ServiceRequestDetailComponent} from './view/service-request-detail/service-request-detail.component';
import {ServiceRequestAddComponent} from './view/service-request-add/service-request-add.component';
import {EmbeddedStopComponent} from './shared/components/embedded-stop/embedded-stop.component';
import {ServiceRequestEditComponent} from './view/service-request-edit/service-request-edit.component';
import {VehicleDetailComponent} from './view/vehicle-detail/vehicle-detail.component';
import {VehicleAddComponent} from './view/vehicle-add/vehicle-add.component';
import {FilterGroupComponent} from './shared/components/filter-group/filter-group.component';
import {EmbeddedStopOverviewComponent} from './shared/components/embedded-stop-overview/embedded-stop-overview.component';
import {FeedbackComponent} from './view/feedback/feedback.component';
import {FeedbackItemComponent} from './view/feedback-item/feedback-item.component';
import {AnnouncementEditComponent} from './view/announcements/edit/announcement-edit.component';
import {EditAnnounementTextComponent} from './view/announcements/edit/text/edit-announcement-text.component';
import {EditAnnouncementDatetimeComponent} from './view/announcements/edit/datetime/edit-announcement-datetime.component';
import {EditAnnouncementStopsComponent} from './view/announcements/edit/stops/edit-announcement-stops.component';
import {DatetimePickerComponent} from './shared/components/datetime-picker/datetime-picker.component';
import {EventsComponent} from './view/events/events.component';
import {EventDetailComponent} from './view/event-detail/event-detail.component';
import {EventAddComponent} from './view/event-add/event-add.component';
import {EventEditComponent} from './view/event-edit/event-edit.component';
import {EmbeddedTripComponent} from './shared/components/embedded-trip/embedded-trip.component';
import {EmbeddedServiceRequestComponent} from './shared/components/embedded-service-request/embedded-service-request.component';
import {EmbeddedFeedbackComponent} from './shared/components/embedded-feedback/embedded-feedback.component';
import {SkipStopComponent} from "./view/stop-skip/stop-skip";
import {EmbeddedAnnouncementsComponent} from './shared/components/embedded-announcements/embedded-announcements.component';
import {AnnouncementMainComponent} from "./view/announcements/main/announcement-main.component";
import {AnnouncementItemComponent} from "./view/announcements/item/announcement-item.component";
import {CharliesRouterReuseStrategy} from "./services/router-reuse-strategy";
import {RouteReuseStrategy} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    TripComponent,
    MenuComponent,
    TripDetailComponent,
    TripEditComponent,
    TripEditDepartureComponent,
    FilterComponent,
    FilterGroupComponent,
    MapComponent,
    LineMapComponent,
    LineDetailComponent,
    StopDetailComponent,
    DropdownComponent,
    EmbeddedLineComponent,
    EmbeddedVehicleComponent,
    EmbeddedStopOverviewComponent,
    ConfirmDeletionComponent,
    TickerComponent,
    TickerItemComponent,
    TripAddComponent,
    VehiclesComponent,
    VehicleDetailComponent,
    VehicleAddComponent,
    FeedbackComponent,
    FeedbackItemComponent,
    ServiceRequestsComponent,
    ServiceRequestDetailComponent,
    ServiceRequestAddComponent,
    SkipStopComponent,
    EmbeddedStopComponent,
    ServiceRequestEditComponent,
    AnnouncementMainComponent,
    AnnouncementEditComponent,
    AnnouncementItemComponent,
    EventsComponent,
    EventDetailComponent,
    EventAddComponent,
    EventEditComponent,
    EmbeddedFeedbackComponent,
    EmbeddedServiceRequestComponent,
    EditAnnounementTextComponent,
    EditAnnouncementDatetimeComponent,
    EditAnnouncementStopsComponent,
    DatetimePickerComponent,
    EmbeddedAnnouncementsComponent,
    EmbeddedTripComponent,
    EmbeddedServiceRequestComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    Angular2FontawesomeModule,
    NgbModule.forRoot(),
  ],
  providers: [
    UrlBuilderService,
    HttpRoutingService,
    MapCreatorService,
    StopSortService,
    DateParserService,
    {provide: RouteReuseStrategy, useClass: CharliesRouterReuseStrategy},
  ],
  bootstrap: [AppComponent],
  // modal dialogs:
  entryComponents: [
    TripEditComponent,
    VehicleAddComponent,
    TripEditDepartureComponent,
    ConfirmDeletionComponent,
    TripAddComponent,
    ServiceRequestAddComponent,
    ServiceRequestEditComponent,
    SkipStopComponent,
    AnnouncementEditComponent,
    EventAddComponent,
    EventEditComponent,
  ]
})
export class AppModule {
}
