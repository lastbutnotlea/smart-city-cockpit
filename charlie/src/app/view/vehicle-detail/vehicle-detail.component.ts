import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {VehicleData} from '../../shared/data/vehicle-data';
import {HttpRoutingService} from '../../services/http-routing.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  vehicle: VehicleData;
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.getVehicle(id).subscribe(
      vehicle => {
        this.vehicle = vehicle;
        this.loaded = true;
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

}
