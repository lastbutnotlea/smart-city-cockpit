import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../services/http-routing.service';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {VehicleData} from '../../shared/data/vehicle-data';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})

export class VehicleAddComponent implements OnInit {
  vehicleTypes: string[] = [];
  selected: DropdownValue = new DropdownValue(null, "");
  capacity: number;
  constructor(public activeModal: NgbActiveModal, private http: HttpRoutingService) {
  }

  ngOnInit(): void {
    this.http.getVehicleTypes().subscribe(types => this.vehicleTypes = types);
  }

  confirm(): void {
    this.http.addVehicle({
      id: null,
      capacity: this.capacity,
      delay: 0,
      temperature: null,
      defects: [],
      type: this.selected.value,
    }).subscribe(
      () => this.activeModal.close('Close click'),
      () => alert("Could not add vehicle"));
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, t));
  }
}
