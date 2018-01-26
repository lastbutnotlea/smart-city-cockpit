import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {LineData} from '../../../shared/data/line-data';
import {StopData} from '../../../shared/data/stop-data';
import {
  DropdownValue,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {VehicleData} from "../../../shared/data/vehicle-data";
import {TripData} from "../../../shared/data/trip-data";
import {TripStopData} from "../../../shared/data/trip-stop-data";
import {DateParserService} from "../../../services/date-parser.service";

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css']
})

export class TripAddComponent implements OnInit {
  @Input()
  model: TripData = null;

  availableLines: LineData[] = [];
  availableVehicles: VehicleData[] = [];

  selectedLine: DropdownValue = new DropdownValue(null, "select line");
  selectedDirection: DropdownValue = new DropdownValue(null, "select direction");
  selectedVehicle: DropdownValue = new DropdownValue(null, "select vehicle");
  selectedStops: Map<StopData, boolean> = new Map();
  selectedDate: Date = new Date();

  showStops: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) {
  }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => this.availableLines = data,
      err => console.log("Err: " + JSON.stringify(err)));
  }

  getLineDropdownItems(): DropdownValue[] {
    return toDropdownItems(this.availableLines, line => line.name);
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
    this.selectedDirection = new DropdownValue(null, "select direction");
    this.showStops = false;
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

  getVehicleDropdownItems(): DropdownValue[] {
    return toDropdownItems(this.availableVehicles, v => v.id);
  }

  isValidDeparture(date: Date): boolean {
    return date > new Date();
  }

  getDirectionString(stops: StopData[]): string {
    return stops[0].commonName + ' -> ' + stops[stops.length - 1].commonName;
  }

  refreshVehicles(availableAt: Date) {
    this.availableVehicles = [];
    this.http.getVehicles().subscribe(
      data => this.availableVehicles = data,
      err => console.log("Could not get vehicles: " + JSON.stringify(err)));
  }

  confirm(): void {
    if (this.model) {
      this.confirmEditTrip();
    } else {
      this.confirmAddTrip();
    }
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
    this.http.addTrip(this.model).subscribe(data => {
      this.activeModal.close('Close click');
    }, err => console.log("An error occurred: " + JSON.stringify(err)));
  }

  private confirmEditTrip() {
    // TODO
  }
}
