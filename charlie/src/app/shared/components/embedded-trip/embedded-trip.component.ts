import {Component, Input, OnInit} from '@angular/core';
import {TripData} from '../../data/trip-data';
import {TripStopData} from '../../data/trip-stop-data';

@Component({
  selector: 'app-embedded-trip',
  templateUrl: './embedded-trip.component.html',
  styleUrls: ['./embedded-trip.component.css']
})

export class EmbeddedTripComponent implements OnInit {

  @Input() trips: TripData[] = [];
  @Input() areTripsForVehicle: boolean = true;

  public ngOnInit(): void {
  }

  public sortTrips(): TripData[] {
    debugger;
    let sorted = [];
    if(this.areTripsForVehicle){
      sorted = this.trips.sort((a: any, b: any) => {
        if (a.stops[0].departureTime < b.stops[0].departureTime) {
          return -1;
        } else if (a.stops[0].departureTime > b.stops[0].departureTime) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      sorted = this.trips.sort((a: any, b: any) => {
        if (a.stops[a.stops.length - 1].departureTime < b.stops[b.stops.length - 1].departureTime) {
          return -1;
        } else if (a.stops[a.stops.length - 1].departureTime > b.stops[b.stops.length - 1].departureTime) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return sorted;
  }

}
