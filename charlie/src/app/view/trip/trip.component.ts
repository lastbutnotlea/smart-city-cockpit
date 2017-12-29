import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripAddComponent} from '../trip-add/trip-add.component';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css', '../../shared/styling/global-styling.css']
})

export class TripComponent implements OnInit {
  title: String;
  trips: TripData[] = [];

  @ViewChild(FilterComponent) compFilter: FilterComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) { }

  public ngOnInit(): void {
    this.title = 'Trip View';

    // get trip data
    this.http.getTrips().subscribe(
      data => this.trips = data,
      err => console.log('Could not fetch trips.')
    );

    this.compFilter.addFilter('Line', trip => trip.line.id === '1');
    this.compFilter.addFilter('Vehicle Type', trip => trip.vehicle.type === 'Bus');
  }

  public isLoaded(): boolean {
    if (this.trips.length > 0) {
      return true;
    }
    return false;
  }

  addTrip(): void {
    const modal = this.modalService.open(TripAddComponent);
    modal.componentInstance.initData();
  }
}
