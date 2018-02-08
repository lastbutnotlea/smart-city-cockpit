import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DropdownValue, loadingDropdown, selectDropdown} from '../../../shared/components/dropdown/dropdown.component';
import {DateUtil} from "../../../shared/util/date-util";
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ToastService} from '../../../services/toast.service';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {VehicleData} from '../../../shared/data/vehicle-data';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})

export class VehicleAddComponent implements OnInit {

  vehicleTypes: string[] = [];
  selected: DropdownValue = loadingDropdown;
  capacity: number = null;
  saveDisabled: boolean = false;

  minCapacity: number = 1;
  maxCapacity: number = 999;
  vehicle: VehicleData = new VehicleData();

  @Output() addEvent = new EventEmitter<VehicleData>();

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.http.getVehicleTypes().subscribe(types => {
      this.selected = selectDropdown;
      this.vehicleTypes = types;
    },err => {
      this.toastService.showErrorToast(
        "Failed to load vehicle types. Please try reloading the page");
      console.log(JSON.stringify(err));
    });
  }

  confirm(): void {
    this.saveDisabled = true;
    this.vehicle.capacity = this.capacity;
    this.vehicle.type = this.selected.value;
    this.vehicle.state = "FINE";
    this.vehicle.freeFrom = DateUtil.cutTimezoneInformation(new Date());

    this.http.addVehicle(this.vehicle).subscribe(
      data => {
        this.toastService.showSuccessToast('Added ' + data.id);
        this.activeModal.close('Close click');
        this.addEvent.emit(this.vehicle);
      },
      err => {
        this.saveDisabled = false;
        this.toastService.showErrorToast('Failed to add vehicle');
        console.log(JSON.stringify(err));
        this.addEvent.emit(null);
      }
    );
  }

  toDropdown(types: string[]): DropdownValue[] {
    return types.map(t => new DropdownValue(t, this.stringFormatter.toFirstUpperRestLower(t)));
  }

  nextDisabled(){
    return this.capacity === null
      || this.selected === selectDropdown
      || this.selected === loadingDropdown
      || this.saveDisabled;
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

  public onClose(): void {
    this.activeModal.close('Close click');
    this.addEvent.emit(null);
  }

  public onDismiss(): void {
    this.activeModal.dismiss('Cross click');
    this.addEvent.emit(null);
  }
}
