import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {StopData} from '../../../shared/data/stop-data';
import {
  DropdownValue, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {TripData} from "../../../shared/data/trip-data";
import {TripStopData} from "../../../shared/data/trip-stop-data";
import {DateParserService} from "../../../services/date-parser.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})

export class TripEditComponent implements OnInit {
  private static readonly loadingDropdown: DropdownValue = new DropdownValue(null, "loading...");
  private static readonly selectDropdown: DropdownValue = new DropdownValue(null, "please select");
  private static readonly noVehiclesAvailDropdown: DropdownValue = new DropdownValue(null, "no vehicles available");

  model: TripData = null;

  availableLines: DropdownValue[] = [];
  availableVehicles: DropdownValue[] = [];

  selectedLine: DropdownValue = TripEditComponent.loadingDropdown;
  selectedDirection: DropdownValue = TripEditComponent.selectDropdown;
  selectedVehicle: DropdownValue = TripEditComponent.loadingDropdown;
  selectedStops: Map<StopData, boolean> = new Map();
  selectedDate: Date = new Date();

  state: number = 0;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) {
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
    }
  }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => {
        this.availableLines = toDropdownItems(data, line => line.name);
        // only if not already set to something meaningful
        if (!this.model) this.selectedLine = TripEditComponent.selectDropdown;
      },
      err => console.log("Err: " + JSON.stringify(err))
    );
  }

  getDirectionDropdownItems(): DropdownValue[] {
    if (this.selectedLine.value !== null) {
      return [
        new DropdownValue(true, this.getDirectionString(this.selectedLine.value.stopsInbound)),
        new DropdownValue(false, this.getDirectionString(this.selectedLine.value.stopsOutbound)),
      ];
    } else {
      return [];
    }
  }

  selectedLineChanged(): void {
    if (!this.getDirectionDropdownItems().some(item => item.label === this.getDirectionString(this.getStops())))
      this.selectedDirection = TripEditComponent.selectDropdown;
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

  stopSelectionChanged(stop: StopData, checked: boolean): void {
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
    let date = this.dateParser.cutTimezoneInformation(this.selectedDate);
    this.http.getVehiclesByTimeAndType(date, this.selectedLine.value.type).subscribe(
      data => {
        this.availableVehicles = toDropdownItems(data, v => v.id);
        if (this.model) {
          let selected: DropdownValue = new DropdownValue(this.model.vehicle, this.model.vehicle.id);
          this.selectedVehicle = selected;
          if (this.availableVehicles.filter(dv => dv.value.id === selected.value.id).length === 0) {
            this.availableVehicles.push(selected);
          }
        } else if (this.availableVehicles.length == 0) {
          this.selectedVehicle = TripEditComponent.noVehiclesAvailDropdown;
        } else {
          this.selectedVehicle = TripEditComponent.selectDropdown;
        }
      },
      err => console.log("Error: " + JSON.stringify(err))
    );
  }

  isNextEnabled(save: boolean = false): boolean {
    if (save && this.state < 2) return false;
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
    this.model = new TripData();
    this.setDataInModel();
    this.http.addTrip(this.model).subscribe(
      data => this.activeModal.close('Close click'),
      err => console.log("An error occurred: " + JSON.stringify(err))
    );
  }

  private confirmEditTrip(): void {
    this.setDataInModel();
    this.http.editTrip(this.model).subscribe(
      data => this.activeModal.close('Close click'),
      err => console.log("An error occurred: " + JSON.stringify(err))
    );
  }

  private setDataInModel(): void {
    this.model.line = this.selectedLine.value;
    this.model.vehicle = this.selectedVehicle.value;
    this.model.isInbound = this.selectedDirection.value;
    this.model.stops = this.getStops().filter(stop => {
      return this.selectedStops.get(stop);
    }).map(stop => new TripStopData(stop.id, null, null, null));
    this.model.stops[0].departureTime = this.dateParser.cutTimezoneInformation(this.selectedDate);
  }
}
