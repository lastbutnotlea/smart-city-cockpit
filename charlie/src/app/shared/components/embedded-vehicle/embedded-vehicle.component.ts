import {Component, Input, OnInit} from '@angular/core';
import {VehicleData} from '../../data/vehicle-data';

@Component({
  selector: 'app-embedded-vehicle',
  templateUrl: './embedded-vehicle.component.html',
  styleUrls: ['./embedded-vehicle.component.css', '../../styling/embedded-components.css',
              '../../styling/global-styling.css']
})

export class EmbeddedVehicleComponent implements OnInit {

  @Input() vehicle: VehicleData;

  public ngOnInit(): void {
  }

}
