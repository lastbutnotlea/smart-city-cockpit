import {Component, OnInit} from "@angular/core";
import {TripDetails} from "../../shared/trip-data";

@Component({
  selector: 'tripview',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent implements OnInit {
  title: String;
  trips: TripDetails[] = [];

  ngOnInit(): void {
    this.title = "trip view";
    this.trips.push(new TripDetails('filtered', 'second'));
    this.trips.push(new TripDetails('first', 'filtered'));
    this.trips.push(new TripDetails('filtered', 'filtered'));
  }

  onChange(val: boolean) {
    //This function is needed to update the table in trip.component.html
  }
}
