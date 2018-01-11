import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {NgModule} from '@angular/core';
import {TripDetailComponent} from './view/trip-detail/trip-detail.component';
import {LineDetailComponent} from './view/line-detail/line-detail.component';
import {StopDetailComponent} from './view/stop-detail/stop-detail.component';
import {VehiclesComponent} from './view/vehicles/vehicles.component';
import {VehicleDetailComponent} from './view/vehicle-detail/vehicle-detail.component';
import {FeedbackComponent} from './view/feedback/feedback.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
