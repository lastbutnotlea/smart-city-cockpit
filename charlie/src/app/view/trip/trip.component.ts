import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripAddComponent} from '../trip-add/trip-add.component';
import { FilterGroupComponent } from '../../shared/components/filter-group/filter-group.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import {StopSortService} from '../../services/stop-sort.service';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent extends LiveDataComponent implements OnInit {
  title: String;
  trips: TripData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              private stopSortService: StopSortService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    super();
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.title = 'Trip View';
    this.addFilter();
    this.getTrips();
    super.subscribeToData();
  }

  private getTrips(): void {
    // get trip data
    this.http.getTrips().subscribe(
      data => {
        this.trips = data;
        this.loaded = true;
        this.trips.forEach(trip => trip.stops = this.stopSortService.sortStops(trip.stops));
        // This starts periodical calls for live-data after first data was received
        },
      err => console.log('Could not fetch trips.')
    );
  }

  addTrip(): void {
    const modal = this.modalService.open(TripAddComponent);
    modal.componentInstance.initData();
    this.toastr.success('You are awesome!', 'Success!');
    this.toastr.error('You are awesome!', 'Success!');
    this.toastr.warning('You are awesome!', 'Success!');
    this.toastr.info('You are awesome!', 'Success!');
    debugger;
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
    this.getTrips();
  }
}
