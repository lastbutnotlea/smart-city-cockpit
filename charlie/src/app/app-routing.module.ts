import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {NgModule} from '@angular/core';
import {TripDetailComponent} from './view/trip-detail/trip-detail.component';
import {LineDetailComponent} from './view/line-detail/line-detail.component';
import {StopDetailComponent} from './view/stop-detail/stop-detail.component';
import {VehiclesComponent} from './view/vehicles/vehicles.component';
import {VehicleDetailComponent} from './view/vehicle-detail/vehicle-detail.component';
import { ServiceRequestsComponent } from './view/service-requests/service-requests.component';
import { ServiceRequestDetailComponent } from './view/service-request-detail/service-request-detail.component';
import {FeedbackComponent} from './view/feedback/feedback.component';
import {AnnouncementMainComponent} from './view/announcements/announcement-main/announcement-main.component';

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
  {path: 'serviceRequests', component: ServiceRequestsComponent},
  {path: 'serviceRequests/:id', component: ServiceRequestDetailComponent},
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
      return '/network/stop/' + id;
    } else if (id.startsWith('Vehicle_')) {
      return '/vehicles/' + id;
    } else if (id.startsWith('Feedback_')) {
      return '/feedback';
    } else {
      return '';
    }
  }
}
