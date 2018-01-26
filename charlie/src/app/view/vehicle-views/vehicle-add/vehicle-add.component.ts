import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DropdownValue} from '../../../shared/components/dropdown/dropdown.component';
import {StringFormatterService} from '../../../services/string-formatter.service';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})

export class VehicleAddComponent implements OnInit {

  vehicleTypes: string[] = [];
  selected: DropdownValue = new DropdownValue(null, "");
  capacity: number;
  saveDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private stringFormatter: StringFormatterService) {
  }

  ngOnInit(): void {
    this.http.getVehicleTypes().subscribe(types => this.vehicleTypes = types);
  }

  confirm(): void {
    this.saveDisabled = true;
    this.http.addVehicle({
      id: null,
      capacity: this.capacity,
      load: 0,
      delay: 0,
      temperature: null,
      defects: [],
      type: this.selected.value,
      state: 'FINE',
      identifiableType: "vehicle",
      freeFrom: '',
      isShutDown: false,
      currentLine: null
    }).subscribe(
      () => this.activeModal.close('Close click'),
      err => {
        console.log(JSON.stringify(err));
      });
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, this.stringFormatter.toFirstUpperRestLower(t)));
  }
}
