import {Component, OnInit} from '@angular/core';
import {TripData} from '../../shared/trip-data';
import { HttpRoutingService } from '../../services/http-routing.service';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent implements OnInit {
  title: String;
  trips: TripData[] = [];

  constructor(private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.title = 'trip view';
    // get trip data
    this.http.getTrips().subscribe( data => {
        console.log(data);
        this.trips = data;
      },
      err => {
        console.log('Could not fetch trips.');
      }
    );
  }

  // This function is needed to update the table in trip.component.html
  // once filter options change
  public onChange(val: boolean) { }

  isLoaded(): boolean {
    if (this.trips.length > 0) {
      return true;
    }
    return false;
  }
}
