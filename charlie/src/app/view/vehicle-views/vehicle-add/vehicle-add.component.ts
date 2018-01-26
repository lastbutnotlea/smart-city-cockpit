import {Component, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DropdownValue} from '../../../shared/components/dropdown/dropdown.component';
import {ToastsManager} from 'ng2-toastr';
import {DateParserService} from "../../../services/date-parser.service";

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})

export class VehicleAddComponent implements OnInit {

  @Output() successEvent = new EventEmitter<boolean>();

  vehicleTypes: string[] = [];
  selected: DropdownValue = new DropdownValue(null, "");
  capacity: number;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) {
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
      identifiableType: "vehicle",
      freeFrom: this.dateParser.cutTimezoneInformation(new Date()),
      isShutDown: false,
      currentLine: null
    }).subscribe(
      () => {
        this.successEvent.emit(true);
        this.activeModal.close('Close click');
      },
          err => {
            this.successEvent.emit(false);
          }
      );
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, t));
  }
}
