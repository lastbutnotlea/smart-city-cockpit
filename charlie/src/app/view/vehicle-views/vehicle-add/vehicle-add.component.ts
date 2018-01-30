import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DropdownValue} from '../../../shared/components/dropdown/dropdown.component';
import {DateParserService} from "../../../services/date-parser.service";
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ToastService} from '../../../services/toast.service';

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
              public stringFormatter: StringFormatterService,
              private dateParser: DateParserService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.http.getVehicleTypes().subscribe(types => this.vehicleTypes = types);
  }

  confirm(): void {
    if(this.capacity <= 0) {
      this.toastService.showErrorToast('Enter positive capacity please');
    }
    else {
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
        freeFrom: DateParserService.cutTimezoneInformation(new Date()),
        isShutDown: false,
        currentLine: null
      }).subscribe(
        data => {
          this.toastService.showSuccessToast('Added ' + data.id);
          this.activeModal.close('Close click');
        },
        err => {
          this.toastService.showErrorToast('Failed to add vehicle');
          this.saveDisabled = false;
        }
      );
    }
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, this.stringFormatter.toFirstUpperRestLower(t)));
  }
}
