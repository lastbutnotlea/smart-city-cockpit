import {RouterModule, Routes} from '@angular/router';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: '', redirectTo: '/network', pathMatch: 'full'},
  {path: 'network', component: NetworkComponent},
  {path: 'trip', component: TripComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
