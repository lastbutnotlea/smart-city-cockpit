import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {VehicleData} from '../../shared/data/vehicle-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VehicleAddComponent} from '../vehicle-add/vehicle-add.component';

@Component({
  selector: 'app-vehicles-component',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  title: string = 'Vehicles';
  loaded: boolean = false;

  vehicles: VehicleData[];

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
    });
  }

  add(): void {
    const modal = this.modalService.open(VehicleAddComponent);
  }
}
