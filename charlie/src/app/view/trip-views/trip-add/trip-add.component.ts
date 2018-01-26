import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {StopData} from '../../../shared/data/stop-data';
import {
  DropdownValue,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {TripData} from "../../../shared/data/trip-data";
import {TripStopData} from "../../../shared/data/trip-stop-data";
import {DateParserService} from "../../../services/date-parser.service";

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css']
})

export class TripAddComponent implements OnInit {
  private static readonly loadingDropdown: DropdownValue = new DropdownValue(null, "loading...");
  private static readonly selectDropdown: DropdownValue = new DropdownValue(null, "please select");
  private static readonly noVehiclesAvailDropdown: DropdownValue = new DropdownValue(null, "no vehicles available");

  @Input()
  model: TripData = null;

  availableLines: DropdownValue[] = [];
  availableVehicles: DropdownValue[] = [];

  selectedLine: DropdownValue = TripAddComponent.loadingDropdown;
  selectedDirection: DropdownValue = TripAddComponent.selectDropdown;
  selectedVehicle: DropdownValue = TripAddComponent.loadingDropdown;
  selectedStops: Map<StopData, boolean> = new Map();
  selectedDate: Date = new Date();

  state: number = 0;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) {
  }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => {
        this.availableLines = toDropdownItems(data, line => line.name);
        this.selectedLine = TripAddComponent.selectDropdown;
      },
      err => console.log("Err: " + JSON.stringify(err)));
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
    this.selectedDirection = TripAddComponent.selectDropdown;
  }

  selectedDirectionChanged(): void {
    this.selectedStops = new Map();
    this.getStops().forEach(stop => this.selectedStops.set(stop, true));
  }

  getStops(): StopData[] {
    if (this.selectedLine.value === null || this.selectedDirection.value === null) {
      return [];
    } else if (this.selectedDirection.value) {
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
        if (this.availableVehicles.length == 0) {
          this.selectedVehicle = TripAddComponent.noVehiclesAvailDropdown;
        } else {
          this.selectedVehicle = TripAddComponent.selectDropdown;
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

  private confirmAddTrip() {
    this.model = new TripData();
    this.model.line = this.selectedLine.value;
    this.model.vehicle = this.selectedVehicle.value;
    this.model.isInbound = this.selectedDirection.value;
    this.model.stops = this.getStops().filter(stop => {
      return this.selectedStops.get(stop);
    }).map(stop => new TripStopData(stop.id, null, null, null));
    this.model.stops[0].departureTime = this.dateParser.cutTimezoneInformation(this.selectedDate);
    this.http.addTrip(this.model).subscribe(
      data => this.activeModal.close('Close click'),
      err => console.log("An error occurred: " + JSON.stringify(err))
    );
  }

  private confirmEditTrip() {
    // TODO
  }
}
