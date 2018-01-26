import {Component, Input, OnInit} from '@angular/core';
import {VehicleData} from '../../data/vehicle-data';
import {StringFormatterService} from '../../../services/string-formatter.service';

@Component({
  selector: 'app-embedded-vehicle',
  templateUrl: './embedded-vehicle.component.html',
  styleUrls: ['./embedded-vehicle.component.css']
})

export class EmbeddedVehicleComponent{

  @Input() vehicle: VehicleData;

  constructor(private stringFormatter: StringFormatterService){};

}
