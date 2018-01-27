import {RouterModule, Routes} from '@angular/router';
import {TripComponent} from './view/trip-views/trip/trip.component';
import {TripDetailComponent} from './view/trip-views/trip-detail/trip-detail.component';
import {NetworkComponent} from './view/network-views/network/network.component';
import {LineDetailComponent} from './view/line-views/line-detail/line-detail.component';
import {StopDetailComponent} from './view/stop-views/stop-detail/stop-detail.component';
import {VehiclesComponent} from './view/vehicle-views/vehicles/vehicles.component';
import {VehicleDetailComponent} from './view/vehicle-views/vehicle-detail/vehicle-detail.component';
import {FeedbackComponent} from './view/feedback-views/feedback/feedback.component';
import {EventsComponent} from './view/event-views/events/events.component';
import {EventDetailComponent} from './view/event-views/event-detail/event-detail.component';
import {ServiceRequestsComponent} from './view/service-request-views/service-requests/service-requests.component';
import {ServiceRequestDetailComponent} from './view/service-request-views/service-request-detail/service-request-detail.component';
import {AnnouncementMainComponent} from './view/announcement-views/main/announcement-main.component';
import {NgModule} from '@angular/core';
import {AdminViewComponent} from './view/admin-view/admin-view.component';

const routes: Routes = [
  {path: '', redirectTo: '/network', pathMatch: 'full'},
  {path: 'trip', component: TripComponent},
  {path: 'trip/detail/:id', component: TripDetailComponent},
  {path: 'network', component: NetworkComponent},
  {path: 'network/detail/:id', component: LineDetailComponent},
  {path: 'network/stop/:stopId', component: StopDetailComponent},
  {path: 'vehicles', component: VehiclesComponent},
  {path: 'vehicles/:id', component: VehicleDetailComponent},
  {path: 'feedback', component: FeedbackComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/detail/:id', component: EventDetailComponent},
  {path: 'serviceRequests', component: ServiceRequestsComponent},
  {path: 'serviceRequests/detail/:id', component: ServiceRequestDetailComponent},
  {path: 'announcements', component: AnnouncementMainComponent},
  {path: 'admin', component: AdminViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
