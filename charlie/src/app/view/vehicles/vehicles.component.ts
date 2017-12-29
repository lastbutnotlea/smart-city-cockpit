import { Component, OnInit } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {VehicleData} from '../../shared/data/vehicle-data';

@Component({
  selector: 'app-vehicles-component',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  title: string = 'Vehicles';
  loaded: boolean = false;

  vehicles: VehicleData[];

  constructor(private http: HttpRoutingService) { }

  ngOnInit() {
    this.http.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.loaded = true;
    })
  }

}
