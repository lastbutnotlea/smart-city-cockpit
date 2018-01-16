import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {VehicleData} from '../../shared/data/vehicle-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { FeedbackData } from '../../shared/data/feedback-data';

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
  feedback: FeedbackData[];

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
        this.getFeedback();
        super.ngOnInit();
        this.loaded = true;
      },
      err => console.log('Could not fetch vehicle data!')
    );
  }

  getFeedback(): void {
    this.http.getVehicleFeedback(this.vehicle.id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        alert("Could not fetch feedback for vehicle! " +
          "Please check your internet connection or inform your system administrator.");
        console.log(err);
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
    this.setDataSubscription(
      this.http.getVehicle(this.vehicle.id).subscribe( data => {
          this.vehicle = data;
          this.getFeedback();
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }

}
