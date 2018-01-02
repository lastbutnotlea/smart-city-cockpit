import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {VehicleData} from '../../shared/data/vehicle-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VehicleAddComponent} from '../vehicle-add/vehicle-add.component';
import {FilterGroupComponent} from '../../shared/components/filter-group/filter-group.component';
import {FilterComponent} from '../../shared/components/filter/filter.component';

@Component({
  selector: 'app-vehicles-component',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  title: string = 'Vehicles';
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  vehicles: VehicleData[];

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
    });
    this.http.getVehicleTypes().subscribe(types => {
      let typeFilter: FilterComponent = new FilterComponent();
      types.forEach(type =>
        typeFilter.addFilter(type, vehicle => vehicle.type === type));
      this.filterGroup.addFilterComponent(typeFilter);
    });
  }

  add(): void {
    const modal = this.modalService.open(VehicleAddComponent);
  }
}
