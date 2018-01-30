import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DropdownValue, loadingDropdown, selectDropdown} from '../../../shared/components/dropdown/dropdown.component';
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

  minCapacity: number = 1;
  maxCapacity: number = 999;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              public stringFormatter: StringFormatterService,
              private dateParser: DateParserService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.http.getVehicleTypes().subscribe(types => {
      this.selected = selectDropdown;
      this.vehicleTypes = types;
    },err => {
      this.toastService.showErrorToast("Failed to load vehicle types. Please reload the page");
      console.log(JSON.stringify(err));
    });
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
      freeFrom: this.dateParser.cutTimezoneInformation(new Date()),
      isShutDown: false,
      currentLine: null
    }).subscribe(
      data => {
        this.toastService.showSuccessToast('Added ' + data.id);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to add vehicle');
        this.activeModal.close('Close click');
        console.log(JSON.stringify(err));
      }
    );
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, this.stringFormatter.toFirstUpperRestLower(t)));
  }

  nextDisabled(){
    return this.capacity === null || this.selected === selectDropdown || this.selected === loadingDropdown || this.saveDisabled;
  }

  validate(event) {
    var output = 1;
    if(this.capacity != null){
      var input = this.capacity.toString();
      var position = event.location;
      output = parseInt([input.slice(0, position), event.key, input.slice(position)].join(''));
    }
    if(isNaN(parseInt(event.key)) || output < this.minCapacity || output > this.maxCapacity) {
      event.preventDefault();
    }
  }
}
