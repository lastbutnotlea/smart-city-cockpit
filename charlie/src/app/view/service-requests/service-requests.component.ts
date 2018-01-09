import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { TripData } from '../../shared/data/trip-data';
import { FilterGroupComponent } from '../../shared/components/filter-group/filter-group.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { ServiceRequestData } from '../../shared/data/service-request-data';
import { VehicleData } from '../../shared/data/vehicle-data';
import { VehicleAddComponent } from '../vehicle-add/vehicle-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service-requests-view',
  templateUrl: './service-requests.component.html',
  styleUrls: ['./service-requests.component.css',
    '../../shared/styling/global-styling.css']
})

export class ServiceRequestsComponent extends LiveDataComponent implements OnInit {
  title: String;
  serviceRequests: ServiceRequestData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) {
    super();
  }

  public ngOnInit(): void {
    this.title = 'Service Request View';
    this.addFilter();
    this.getServiceRequests();
  }

  private getServiceRequests(): void {
    // get trip data
    this.http.getServiceRequests().subscribe(
      data => {
        this.serviceRequests = data;
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
        },
      err => console.log('Could not fetch trips.')
    );
  }

  private addFilter(): void {
    this.http.getFilterData().subscribe(
      data => {
        // TODO: add filter for service type (cleaning or maintenance)
        // TODO: add filter for target type (vehicle or stop)
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
    this.http.getServiceRequests().subscribe( data => {
        this.serviceRequests = data;
        this.subscribeToData();
      },
      err =>
        console.log('Could not fetch new line-data.')
    ));
  }

  add(): void {
    // TODO: open add component once available
    // const modal = this.modalService.open(ServiceRequestAddComponent);
  }
}
