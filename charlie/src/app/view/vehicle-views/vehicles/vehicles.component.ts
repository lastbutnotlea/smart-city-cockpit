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
    }, err => {
      this.toastService.showLastingErrorToast('Failed to filter data');
      console.log(JSON.stringify(err));
    });
    super.subscribeToData();
  }

  getVehicles(): void {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
    }, err => {
      this.toastService.showLastingErrorToast('Failed to load vehicles');
      console.log(JSON.stringify(err));
    });
    this.http.getVehiclesState().subscribe(data => {
      this.state = data;
    }, err => {
      this.toastService.showLastingErrorToast('Failed to load state of vehicles');
      console.log(JSON.stringify(err));
    })
  }

  add(): void {
    //stop requesting live-data during add-process
    super.unsubscribe();
    const modal = this.modalService.open(VehicleAddComponent);
    modal.componentInstance.addEvent.subscribe(($event) => {
      this.vehicles.push($event);
    });
    modal.componentInstance.closeEvent.subscribe(() => {
      super.subscribeToData();
    })
  }

  // update vehicles
  refreshData(): void {
    this.getVehicles();
  }

  goToLink(id: string): void {
    let link: string = getUrlForId(id);
    this.router.navigate([link]);
  }

  searchVehicle(list: VehicleData[], text: string): VehicleData[] {
    return list.filter(v => v.load.toString().toLowerCase().includes(text.toLowerCase())
      || v.capacity.toString().toLowerCase().includes(text.toLowerCase())
      || v.delay.toString().toLowerCase().includes(text.toLowerCase())
      || v.temperature.toString().toLowerCase().includes(text.toLowerCase())
      || v.defects.toString().toLowerCase().includes(text.toLowerCase())
      || v.type.toLowerCase().includes(text.toLowerCase())
      || v.state.toLowerCase().includes(text.toLowerCase())
      || v.freeFrom.toLowerCase().includes(text.toLowerCase())
      || v.currentLine.name.toLowerCase().includes(text.toLowerCase()));
  }
}
