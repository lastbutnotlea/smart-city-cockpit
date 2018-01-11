import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {VehicleData} from '../../shared/data/vehicle-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css',
              '../../shared/styling/global-styling.css',
              '../../shared/styling/embedded-components.css']
})
export class VehicleDetailComponent extends LiveDataComponent implements OnInit {

  vehicle: VehicleData;
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.getVehicle(id).subscribe(
      vehicle => {
        this.vehicle = vehicle;
        this.loaded = true;
        super.ngOnInit();
      },
      err => console.log('Could not fetch vehicle data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  delete(): void {
    this.http.deleteVehicle(this.vehicle.id).subscribe(
      () => this.goBack(),
      () => alert("Could not delete vehicle"));
  }

  // update trip data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getVehicle(this.vehicle.id).subscribe( data => {
          this.vehicle = data;
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }

}
