import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {NgModule} from '@angular/core';
import { TripDetailComponent } from './view/trip-detail/trip-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/network', pathMatch: 'full'},
  {path: 'network', component: NetworkComponent},
  {path: 'trip', component: TripComponent},
  {path: 'trip/detail/:id', component: TripDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
