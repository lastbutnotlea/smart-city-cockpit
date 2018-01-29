import {AppComponent} from './app.component';
import {FilterComponent} from './shared/components/filter/filter.component';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapCreatorService} from './services/map-creator.service';
import {NgModule} from '@angular/core';
import {DropdownComponent} from './shared/components/dropdown/dropdown.component';
import {EmbeddedLineComponent} from './shared/components/embedded-line/embedded-line.component';
import {EmbeddedVehicleComponent} from './shared/components/embedded-vehicle/embedded-vehicle.component';
import {ConfirmDeletionComponent} from './shared/components/confirm-popup/confirm-deletion.component';
import {StopSortService} from './services/stop-sort.service';
import {DateParserService} from './services/date-parser.service';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {TickerComponent} from './view/ticker/ticker-main/ticker.component';
import {TickerItemComponent} from './view/ticker/ticker-item/ticker-item.component';
import {FilterGroupComponent} from './shared/components/filter-group/filter-group.component';
import {EmbeddedStopOverviewComponent} from './shared/components/embedded-stop-overview/embedded-stop-overview.component';
import {DatetimePickerComponent} from './shared/components/datetime-picker/datetime-picker.component';
import {EmbeddedTripComponent} from './shared/components/embedded-trip/embedded-trip.component';
import {EmbeddedServiceRequestComponent} from './shared/components/embedded-service-request/embedded-service-request.component';
import {EmbeddedFeedbackComponent} from './shared/components/embedded-feedback/embedded-feedback.component';
import {EmbeddedAnnouncementsComponent} from './shared/components/embedded-announcements/embedded-announcements.component';
import {NetworkComponent} from './view/network-views/network/network.component';
import {TripComponent} from './view/trip-views/trip/trip.component';
import {StateIconComponent} from './shared/components/state-icon/state-icon.component';
import {MenuComponent} from './menu/menu.component';
import {TripDetailComponent} from './view/trip-views/trip-detail/trip-detail.component';
import {MapComponent} from './view/network-views/map/map.component';
import {LineDetailComponent} from './view/line-views/line-detail/line-detail.component';
import {StopDetailComponent} from './view/stop-views/stop-detail/stop-detail.component';
import {TripEditComponent} from './view/trip-views/trip-edit/trip-edit.component';
import {VehiclesComponent} from './view/vehicle-views/vehicles/vehicles.component';
import {VehicleAddComponent} from './view/vehicle-views/vehicle-add/vehicle-add.component';
import {VehicleDetailComponent} from './view/vehicle-views/vehicle-detail/vehicle-detail.component';
import {FeedbackComponent} from './view/feedback-views/feedback/feedback.component';
import {FeedbackItemComponent} from './view/feedback-views/feedback-item/feedback-item.component';
import {ServiceRequestsComponent} from './view/service-request-views/service-requests/service-requests.component';
import {ServiceRequestDetailComponent} from './view/service-request-views/service-request-detail/service-request-detail.component';
import {ServiceRequestEditComponent} from './view/service-request-views/service-request-edit/service-request-edit.component';
import {SkipStopComponent} from './view/stop-views/stop-skip/stop-skip';
import {EmbeddedStopComponent} from './shared/components/embedded-stop/embedded-stop.component';
import {AnnouncementMainComponent} from './view/announcement-views/main/announcement-main.component';
import {AnnouncementEditComponent} from './view/announcement-views/edit/announcement-edit.component';
import {AnnouncementItemComponent} from './view/announcement-views/item/announcement-item.component';
import {EventsComponent} from './view/event-views/events/events.component';
import {EventDetailComponent} from './view/event-views/event-detail/event-detail.component';
import {EventAddComponent} from './view/event-views/event-add/event-add.component';
import {EventEditComponent} from './view/event-views/event-edit/event-edit.component';
import {EditAnnounementTextComponent} from './view/announcement-views/edit/text/edit-announcement-text.component';
import {EditAnnouncementDatetimeComponent} from './view/announcement-views/edit/datetime/edit-announcement-datetime.component';
import {EditAnnouncementStopsComponent} from './view/announcement-views/edit/stops/edit-announcement-stops.component';
import {RouteReuseStrategy} from "@angular/router";
import {StringFormatterService} from './services/string-formatter.service';
import {CharliesRouterReuseStrategy} from "./services/router-reuse-strategy";
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastService} from './services/toast.service';
import {AdminViewComponent} from './view/admin-view/admin-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    TripComponent,
    MenuComponent,
    TripDetailComponent,
    FilterComponent,
    FilterGroupComponent,
    MapComponent,
    LineDetailComponent,
    StopDetailComponent,
    DropdownComponent,
    EmbeddedLineComponent,
    EmbeddedVehicleComponent,
    EmbeddedStopOverviewComponent,
    ConfirmDeletionComponent,
    TickerComponent,
    TickerItemComponent,
    TripEditComponent,
    VehiclesComponent,
    VehicleDetailComponent,
    VehicleAddComponent,
    FeedbackComponent,
    FeedbackItemComponent,
    ServiceRequestsComponent,
    ServiceRequestDetailComponent,
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
    StateIconComponent,
    AdminViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    Angular2FontawesomeModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    NgbModule.forRoot()
  ],
  providers: [
    UrlBuilderService,
    HttpRoutingService,
    MapCreatorService,
    StopSortService,
    DateParserService,
    StringFormatterService,
    ToastService,
    {provide: RouteReuseStrategy, useClass: CharliesRouterReuseStrategy},
  ],
  bootstrap: [AppComponent],
  // modal dialogs:
  entryComponents: [
    VehicleAddComponent,
    ConfirmDeletionComponent,
    TripEditComponent,
    ServiceRequestEditComponent,
    SkipStopComponent,
    AnnouncementEditComponent,
    EventAddComponent,
    EventEditComponent,
  ]
})
export class AppModule {
}
