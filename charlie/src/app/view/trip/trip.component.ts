import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripAddComponent} from '../trip-add/trip-add.component';
import { FilterGroupComponent } from '../../shared/components/filter-group/filter-group.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css',
    '../../shared/styling/global-styling.css']
})

export class TripComponent extends LiveDataComponent implements OnInit {
  title: String;
  trips: TripData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) {
    super();
  }

  public ngOnInit(): void {
    this.title = 'Trip View';
    this.addFilter();
    this.getTrips();
  }

  private getTrips(): void {
    // get trip data
    this.http.getTrips().subscribe(
      data => {
        this.trips = data;
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
        },
      err => console.log('Could not fetch trips.')
    );
  }

  addTrip(): void {
    const modal = this.modalService.open(TripAddComponent);
    modal.componentInstance.initData();
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
      },
      err =>
        console.log('Could not fetch new line-data.')
    ));
    this.subscribeToData();
  }
}
