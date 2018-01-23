import {Component, Input, OnInit} from '@angular/core';
import {TripData} from '../../data/trip-data';

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

}
