import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import { FilterGroupComponent } from '../../shared/components/filter-group/filter-group.component';
import { GeneralizedComponent } from '../../shared/components/generalized/live-data.component';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css',
    '../../shared/styling/global-styling.css']
})

export class TripComponent extends GeneralizedComponent implements OnInit {
  title: String;
  trips: TripData[] = [];

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService) {
    super();
  }

  public ngOnInit(): void {
    this.title = 'Trip View';
    this.addFilter();
    this.getTrips();
  }

  public isLoaded(): boolean {
    if (this.trips.length > 0) {
      return true;
    }
    return false;
  }

  private getTrips(): void {
    // get trip data
    this.http.getTrips().subscribe(
      data => {
        this.trips = data;
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
        },
      err => console.log('Could not fetch trips.')
    );
  }

  private addFilter(): void {
    this.http.getFilterData().subscribe(
      data => {
        // add filters for vehicles
        let vehicleFilter = new FilterComponent();
        for (let val in data.types) {
          let name = data.types[val];
          vehicleFilter.addFilter(name, trip => trip.vehicle.type === name);
        }
        this.filterGroup.addFilterComponent(vehicleFilter);
        // add filters for lines
        let lineFilter = new FilterComponent();
        for (let val in data.lineNames) {
          let name = data.lineNames[val];
          lineFilter.addFilter(name, trip => trip.line.name === name);
        }
        this.filterGroup.addFilterComponent(lineFilter);
        // TODO: change this if needed data can be requested from backend
        let stateFilter = new FilterComponent();
        stateFilter.addFilter('Fine', trip => trip.vehicle.state === 'FINE');
        stateFilter.addFilter('Problematic', trip => trip.vehicle.state === 'PROBLEMATIC');
        stateFilter.addFilter('Critical', trip => trip.vehicle.state === 'CRITICAL');
        this.filterGroup.addFilterComponent(stateFilter);
      },
      err => {
        console.log('Could not fetch filter data!');
      }
    )
  }

  // update trips
  refreshData(): void {
    this.setDataSubscription(
    this.http.getTrips().subscribe( data => {
        this.trips = data;
        this.subscribeToData();
      },
      err =>
        console.log('Could not fetch new line-data.')
    ));
  }
}
