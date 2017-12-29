import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
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

  constructor(private http: HttpRoutingService) { }

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
    this.http.getFilterData().subscribe(
      data => {
        // add filters for vehicles
        let vehicleFilter = new FilterComponent();
        for(let val in data.types){
          let name = data.types[val];
          vehicleFilter.addFilter(name, trip => trip.vehicle.type === name);
        }
        this.filterGroup.addFilterComponent(vehicleFilter);
        // add filters for lines
        let lineFilter = new FilterComponent();
        for(let val in data.lineNames){
          let name = data.lineNames[val];
          lineFilter.addFilter(name, trip => trip.line.name === name);
        }
        this.filterGroup.addFilterComponent(lineFilter);
      },
      err => {
        console.log('Could not fetch filter data!');
      }
    )


/*    this.filterCreator.addVehicleFilters(this.filterGroup.getFilter('vehicleFilter'));
    this.filterCreator.addLineFilters(this.filterGroup.getFilter('lineFilter'));*/
  }
}
