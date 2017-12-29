import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import { FilterCreatorService } from '../../services/filter-creator.service';
import { FilterGroupComponent } from '../../shared/components/filter-group/filter-group.component';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent implements OnInit {
  title: String;
  trips: TripData[] = [];

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private filterCreator: FilterCreatorService) { }

  public ngOnInit(): void {
    this.title = 'Trip View';
    this.addFilter();



    // get trip data
    this.http.getTrips().subscribe(
      data => this.trips = data,
      err => console.log('Could not fetch trips.')
    );
  }

  public isLoaded(): boolean {
    if (this.trips.length > 0) {
      return true;
    }
    return false;
  }

  private addFilter(): void {
    this.filterGroup.addFilterComponent('vehicleFilter');
    this.filterGroup.addFilterComponent('lineFilter');
    this.filterCreator.addVehicleFilters(this.filterGroup.getFilter('vehicleFilter'));
    this.filterCreator.addLineFilters(this.filterGroup.getFilter('lineFilter'));
  }
}
