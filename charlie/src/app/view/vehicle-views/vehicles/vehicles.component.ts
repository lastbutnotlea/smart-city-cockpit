import {Component, OnInit, ViewChild} from '@angular/core';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {FilterGroupComponent} from '../../../shared/components/filter-group/filter-group.component';
import {VehicleData} from '../../../shared/data/vehicle-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterComponent} from '../../../shared/components/filter/filter.component';
import {VehicleAddComponent} from '../vehicle-add/vehicle-add.component';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {Router} from "@angular/router";
import {getUrlForId} from "../../../shared/util/routing-util";
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-vehicles-component',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent extends LiveDataComponent implements OnInit {
  title: string = 'Vehicles';
  loaded: boolean = false;
  state: string = "";

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  vehicles: VehicleData[];

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              public stringFormatter: StringFormatterService,
              private router: Router,
              private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.getVehicles();
    this.http.getVehicleTypes().subscribe(types => {
      let typeFilter: FilterComponent = new FilterComponent();
      types.forEach(type =>
        typeFilter.addFilter(this.stringFormatter.toFirstUpperRestLower(type),
            vehicle => vehicle.type === type));
      this.filterGroup.addFilterComponent(typeFilter);

      // TODO: change this if needed data can be requested from backend
      let stateFilter = new FilterComponent();
      stateFilter.addFilter('Fine', vehicle => vehicle.state === 'FINE');
      stateFilter.addFilter('Problematic', vehicle => vehicle.state === 'PROBLEMATIC');
      stateFilter.addFilter('Critical', vehicle => vehicle.state === 'CRITICAL');
      this.filterGroup.addFilterComponent(stateFilter);
    });
    super.subscribeToData();
  }

  getVehicles(): void {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
    }, err => {
      console.log(err);
    });
    this.http.getVehiclesState().subscribe(data => {
      this.state = data;
    }, err => {
      console.log(err);
    })
  }

  add(): void {
    const modal = this.modalService.open(VehicleAddComponent);
  }

  // update vehicles
  refreshData(): void {
    this.getVehicles();
  }

  goToLink(id: string): void {
    let link: string = getUrlForId(id);
    this.router.navigate([link]);
  }
}
