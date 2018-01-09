import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {VehicleData} from '../../shared/data/vehicle-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VehicleAddComponent} from '../vehicle-add/vehicle-add.component';
import {FilterGroupComponent} from '../../shared/components/filter-group/filter-group.component';
import {FilterComponent} from '../../shared/components/filter/filter.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';

@Component({
  selector: 'app-vehicles-component',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css',
    '../../shared/styling/global-styling.css']
})
export class VehiclesComponent extends LiveDataComponent implements OnInit {
  title: string = 'Vehicles';
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  vehicles: VehicleData[];

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
      super.ngOnInit();
    });
    this.http.getVehicleTypes().subscribe(types => {
      let typeFilter: FilterComponent = new FilterComponent();
      types.forEach(type =>
        typeFilter.addFilter(type, vehicle => vehicle.type === type));
      this.filterGroup.addFilterComponent(typeFilter);

      // TODO: change this if needed data can be requested from backend
      let stateFilter = new FilterComponent();
      stateFilter.addFilter('Fine', vehicle =>vehicle.state === 'FINE');
      stateFilter.addFilter('Problematic', vehicle => vehicle.state === 'PROBLEMATIC');
      stateFilter.addFilter('Critical', vehicle => vehicle.state === 'CRITICAL');
      this.filterGroup.addFilterComponent(stateFilter);
    });
  }

  add(): void {
    const modal = this.modalService.open(VehicleAddComponent);
  }

  // update vehicles
  refreshData(): void {
    this.setDataSubscription(
      this.http.getVehicles().subscribe( data => {
          this.vehicles = data;
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }
}
