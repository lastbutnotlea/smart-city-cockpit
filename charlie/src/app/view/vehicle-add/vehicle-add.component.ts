import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../services/http-routing.service';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';

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
      load: 0,
      delay: 0,
      temperature: null,
      defects: [],
      type: this.selected.value,
      state: 'FINE',
      identifiableType: "vehicle"
    }).subscribe(
      () => this.activeModal.close('Close click'),
      err => {
        if(err == null) {
          alert("Could not add vehicle")
        }
        console.log(JSON.stringify(err));
      });
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, t));
  }
}
