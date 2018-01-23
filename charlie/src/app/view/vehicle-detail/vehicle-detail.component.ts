import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {VehicleData} from '../../shared/data/vehicle-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { FeedbackData } from '../../shared/data/feedback-data';
import {TripData} from '../../shared/data/trip-data';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent extends LiveDataComponent implements OnInit {

  vehicle: VehicleData;
  loaded: boolean = false;
  feedback: FeedbackData[] = [];
  trips: TripData[] = [];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.getVehicleData();
    super.subscribeToData();
  }

  getVehicleData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.getVehicle(id).subscribe(
      vehicle => {
        this.vehicle = vehicle;
        this.getFeedback();
        this.getTripsForVehicle(id);
        this.loaded = true;
      },
      err => console.log('Could not fetch vehicle data!')
    );
  }

  getTripsForVehicle(vehicleId: string): void {
    this.http.getTripsForVehicle(vehicleId).subscribe(
      trips => this.trips = trips,
      err => console.log('Could not fetch trip data, sorry!')
    );
  }

  getFeedback(): void {
    this.http.getVehicleFeedback(this.vehicle.id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        console.log(JSON.stringify(err));
      }
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
    this.getVehicleData();
  }

}
