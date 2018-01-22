import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {NgModule} from '@angular/core';
import {TripDetailComponent} from './view/trip-detail/trip-detail.component';
import {LineDetailComponent} from './view/line-detail/line-detail.component';
import {StopDetailComponent} from './view/stop-detail/stop-detail.component';
import {VehiclesComponent} from './view/vehicles/vehicles.component';
import {VehicleDetailComponent} from './view/vehicle-detail/vehicle-detail.component';
import {ServiceRequestsComponent} from './view/service-requests/service-requests.component';
import {ServiceRequestDetailComponent} from './view/service-request-detail/service-request-detail.component';
import {FeedbackComponent} from './view/feedback/feedback.component';
import {AnnouncementMainComponent} from './view/announcements/announcement-main/announcement-main.component';
import {EventsComponent} from './view/events/events.component';
import {EventDetailComponent} from './view/event-detail/event-detail.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  static getUrlForId(id: string): string {
    if (id.startsWith('Trip_')) {
      return '/trip/detail/' + id;
    } else if (id.startsWith('Line_')) {
      return '/network/detail/' + id;
    } else if (id.startsWith('Stop_')) {
      // This is actually dead because the backend has stop Ids without the Stop_ prefix.
      return '/network/stop/' + id;
    } else if (id.startsWith('Vehicle_')) {
      return '/vehicles/' + id;
    } else if (id.startsWith('Feedback_')) {
      return '/feedback';
    } else {
      console.debug('No target for \'' + id + '\' found, assuming it is a stop');
      return '/network/stop/' + id;
    }
  }
}
