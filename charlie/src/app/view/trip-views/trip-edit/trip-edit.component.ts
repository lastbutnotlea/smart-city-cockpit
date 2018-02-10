import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {StopData} from '../../../shared/data/stop-data';
import {
  DropdownValue,
  loadingDropdown,
  selectDropdown,
  toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {TripData} from "../../../shared/data/trip-data";
import {TripStopData} from "../../../shared/data/trip-stop-data";
import {DateUtil} from "../../../shared/util/date-util";
import {isNullOrUndefined} from "util";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})

export class TripEditComponent implements OnInit {
  model: TripData = null;

  availableLines: DropdownValue[] = [];
  availableVehicles: DropdownValue[] = [];

  selectedLine: DropdownValue = loadingDropdown;
  selectedDirection: DropdownValue = selectDropdown;
  selectedVehicle: DropdownValue = loadingDropdown;
  selectedStops: Map<StopData, boolean> = new Map();
  selectedDate: Date = new Date();

  state: number = 0;

  title: string = "Add new trip";
  confirmed: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private toastService: ToastService) {
  }

  public setModel(data: TripData): void {
    this.model = data;
  }

  public initData(): void {
    if (this.model) {
      this.selectedLine = toDropdownItem(this.model.line, line => line.name);
      this.selectedDirection = new DropdownValue(this.model.isInbound, this.getDirectionString(this.getStops(this.model.isInbound)));
      this.selectedVehicle = toDropdownItem(this.model.vehicle, vehicle => vehicle.id);
      this.getStops().forEach(stop => {
        this.selectedStops.set(stop, this.model.stops.filter(s => {
          return s.id === stop.id;
        }).length !== 0);
      });
      this.selectedDate = new Date(this.model.stops[0].departureTime);
      this.title = "Edit " + this.model.id;
    }
  }

  ngOnInit(): void {
    let selected = this.selectedLine;
    this.selectedLine = loadingDropdown;
    this.http.getLines().subscribe(
      data => {
        this.availableLines = toDropdownItems(data, line => line.name);
        let isSelectedValid = selected.value && this.availableLines.some(l => {
          return l.value.id === selected.value.id;
        });
        if (isSelectedValid) {
          this.selectedLine = selected;
        } else {
          this.selectedLine = selectDropdown;
        }
      },
      err => {
        console.log("Err: " + JSON.stringify(err));
        this.toastService.showErrorToast("Could not load lines.");
      }
    );
  }

  getDirectionDropdownItems(): DropdownValue[] {
    if (this.selectedLine.value !== null) {
      return [
        new DropdownValue(true, this.getDirectionString(this.getStops(true))),
        new DropdownValue(false, this.getDirectionString(this.getStops(false))),
      ];
    } else {
      return [];
    }
  }

  selectedLineChanged(): void {
    this.selectedDirection = selectDropdown;
  }

  selectedDirectionChanged(): void {
    this.selectedStops = new Map();
    this.getStops().forEach(stop => this.selectedStops.set(stop, true));
  }

  getStops(inbound?: boolean): StopData[] {
    if (isNullOrUndefined(inbound)) {
      inbound = this.selectedDirection.value;
    }
    if (this.selectedLine.value === null || inbound === null) {
      return [];
    } else if (inbound) {
      return this.selectedLine.value.stopsInbound;
    } else {
      return this.selectedLine.value.stopsOutbound;
    }
  }

  stopSelectionChanged(stop: StopData): void {
    this.selectedStops.set(stop, !this.selectedStops.get(stop));
  }

  isValidDeparture(date: Date): boolean {
    return date > new Date();
  }

  getDirectionString(stops: StopData[]): string {
    return stops[0].commonName + ' -> ' + stops[stops.length - 1].commonName;
  }

  refreshVehicles(): void {
    this.availableVehicles = [];
    let selected = this.selectedVehicle;
    this.selectedVehicle = loadingDropdown;
    let date = DateUtil.cutTimezoneInformation(this.selectedDate);
    this.http.getVehiclesByTimeAndType(date, this.selectedLine.value.type, this.model).subscribe(
      data => {
        this.availableVehicles = toDropdownItems(data, v => v.id);
        let isSelectedValid = selected.value && this.availableVehicles.some(v => {
          return v.value.id === selected.value.id;
        });
        if (isSelectedValid) {
          this.selectedVehicle = selected;
        } else if (this.availableVehicles.length == 0) {
          this.selectedVehicle = new DropdownValue(null, "no vehicles available");
        } else {
          this.selectedVehicle = selectDropdown;
        }
      },
      err => {
        console.log("Error: " + JSON.stringify(err));
        this.toastService.showErrorToast("Could not get available vehicles.");
      }
    );
  }

  isNextEnabled(save: boolean = false): boolean {
    if (save && this.state < 2) return false;
    if ((save && this.state == 2) || this.state == 3) {
      if (this.getStops().filter(stop => this.selectedStops.get(stop)).length < 2) {
        return false;
      }
    }
    switch (this.state) {
      case 0:
        return this.selectedLine.value !== null && this.selectedDirection.value !== null;
      case 2:
        return this.selectedVehicle.value !== null;
      default:
        return true;
    }
  }

  next(save: boolean = false): void {
    if (!this.isNextEnabled(save)) return;
    if (this.state < 3 && !save) {
      this.state++;
      if (this.state == 2) {
        this.refreshVehicles();
      }
    } else if (this.model) {
      this.confirmEditTrip();
    } else {
      this.confirmAddTrip();
    }
  }

  isBackEnabled(): boolean {
    return this.state > 0;
  }

  back(): void {
    if (!this.isBackEnabled()) return;
    this.state--;
  }

  private confirmAddTrip(): void {
    this.confirmed = true;
    this.model = new TripData();
    this.setDataInModel();
    this.http.addTrip(this.model).subscribe(
      data => {
        this.activeModal.close('Close click');
        this.confirmed = false;
        this.toastService.showSuccessToast(data.id + ' created.');
      },
      err => {
        console.log("An error occurred: " + JSON.stringify(err));
        this.toastService.showErrorToast('An error occurred.');
        this.confirmed = false;
      }
    );
  }

  private confirmEditTrip(): void {
    this.confirmed = true;
    this.setDataInModel();
    this.http.editTrip(this.model).subscribe(
      () => {
        this.activeModal.close('Close click');
        this.confirmed = false;
        this.toastService.showSuccessToast('Edited ' + this.model.id + '.');
      },
      err => {
        console.log("An error occurred: " + JSON.stringify(err));
        this.toastService.showErrorToast('An error occurred: ' + JSON.stringify(err));
        this.confirmed = false;
      }
    );
  }

  private setDataInModel(): void {
    this.model.line = this.selectedLine.value;
    this.model.vehicle = this.selectedVehicle.value;
    this.model.isInbound = this.selectedDirection.value;
    this.model.stops = this.getStops().filter(stop => {
      return this.selectedStops.get(stop);
    }).map(stop => new TripStopData(stop.id, null, stop.commonName, stop.state));
    this.model.stops[0].departureTime = DateUtil.cutTimezoneInformation(this.selectedDate);
  }
}
