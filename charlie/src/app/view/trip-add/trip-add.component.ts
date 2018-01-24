import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/data/line-data';
import {VehicleData} from '../../shared/data/vehicle-data';
import {StopData} from '../../shared/data/stop-data';
import {TripStopData} from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {StopSortService} from '../../services/stop-sort.service';
import {DateParserService} from '../../services/date-parser.service';
import {dummyDate, now} from '../../shared/data/dates';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css']
})

export class TripAddComponent implements OnInit {
  // stores data of the new trip
  selected: TripData;
  // this array is needed to display all available stops of the currently selected line
  selectedLineStops: StopData[];
  selectedTime: string = now.toISOString();
  displayStops: boolean = false;

  // store values of dropdown components
  selectedVehicle: DropdownValue;
  selectedLine: DropdownValue;
  selectedDirection: DropdownValue;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];

  date: NgbDateStruct;
  time: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private stopSortService: StopSortService,
              private dateParser: DateParserService) {
  }

  ngOnInit(): void {
    this.selectedVehicle = new DropdownValue(0, 'loading');
    this.selectedLine = new DropdownValue(0, 'loading');
    this.selectedDirection = this.directionItem();

    this.time = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
    this.date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.updateDate();
    this.updateTime();
  }

  initData(): void {
    this.selected = new TripData();
    // fetch available lines
    this.http.getLines().subscribe(
      data => {
        // fetch lines
        this.availLines = data;
        this.selectedLine = this.toDropdownItemL(this.availLines[0]);
        this.selectedLineStops = this.selectedLine.value.stopsInbound;
        // fill selected.stops with inbound stops
        this.selected.stops = [];
        for (const stop of this.selectedLineStops) {
          this.selected.stops.push(new TripStopData(stop.id, dummyDate, stop.commonName, stop.state));
        }
      },
      err => console.log('Err'));

    // fetch available vehicles
    this.http.getVehiclesWithCurrentTrip().subscribe(
      data => {
        this.availVehicles = data;
        this.selectedVehicle = this.toDropdownItemV(this.availVehicles[0]);
      },
      err => console.log('Err'));
  }

  stopsVisible(): boolean {
    return this.displayStops;
  }

  showStops(): void {
    this.refreshData();
    this.displayStops = true;
  }

  // refreshes all the data of the new trip
  refreshData(): void {
    this.selected.line = this.selectedLine.value;
    // set selectedLineStops to inbound/outbound stops of current line depending on value in dropdown
    if (this.selectedDirection.value) {
      this.selectedLineStops = this.selected.line.stopsInbound;
    }
    else {
      this.selectedLineStops = this.selected.line.stopsOutbound;
    }

    this.selected.stops = [];
    for (const stop of this.selectedLineStops) {
      this.selected.stops.push(new TripStopData(stop.id, dummyDate, stop.commonName, stop.state));
    }

    this.refreshVehicleAndLineData();
  }

  // refreshes only vehicle and line data of the new trip
  refreshVehicleAndLineData(): void {
    this.selected.vehicle = this.selectedVehicle.value;
    this.selected.line = this.selectedLine.value;
    this.selected.isInbound = this.selectedDirection.value;
    this.selected.stops[0].departureTime = this.selectedTime;
  }

  confirm(): void {
    // don't call refreshData() here to keep selected stops
    this.refreshVehicleAndLineData();
    console.log(this.selected);
    this.activeModal.close('Close click');
    this.http.addTrip(this.selected).subscribe(
      data => {
      },
      // Currently, we get a http-response here that is interpreted as an error
      // (maybe parsing the response does not work for some reason)
      // The response should contain the http-code 200 (ok) if adding the trip was successful
      // TODO: these messages should not be interpreted as errors!
      err => {
        // debugger;
        if (err.status === 200) {
          console.log('Added trip.');
        } else {
          console.log('Could not add trip.');
        }
      }
    );
  }

  isChecked(stop: StopData): boolean {
    // returns true if selected.stops contains one object with the id of stop
    return this.selected.stops.filter(tripStop => tripStop.id === stop.id).length === 1;
  }

  /**
   * @param {StopData} stop: stop to be included or excluded
   * @param {boolean} included: states whether the stop should be included or excluded
   */
  includeStop(stop: StopData, included: boolean): void {
    if (included) {
      this.selected.stops.push(new TripStopData(stop.id, dummyDate, stop.commonName, stop.state));
    } else {
      this.selected.stops = this.selected.stops.filter(filteredStop => filteredStop.id !== stop.id);
      this.selected.stops = this.stopSortService.sortStops(this.selected.stops);
    }
    console.log(JSON.stringify(this.selected.stops));
  }

  toDropdownItemV(item: VehicleData): DropdownValue {
    return new DropdownValue(item, item.id);
  }

  toDropdownItemsV(items: VehicleData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItemV(item));
  }

  toDropdownItemL(item: LineData): DropdownValue {
    return new DropdownValue(item, item.name);
  }

  toDropdownItemsL(items: LineData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItemL(item));
  }

  directionItem(): DropdownValue {
    return new DropdownValue(true, 'Inbound');
  }

  directionItems(): DropdownValue[] {
    let directionItems: DropdownValue[] = [];
    directionItems.push(new DropdownValue(true, 'Inbound'));
    directionItems.push(new DropdownValue(false, 'Outbound'));
    return directionItems;
  }

  updateDate(): void {
    let freeFrom: Date = new Date(this.selected.vehicle.freeFrom);
    if(this.dateParser.isBeforeDate(freeFrom, this.date)) {
      this.selectedTime = this.dateParser.parseDate(this.selectedTime, this.date);
      // Date might have been set to current date. Time could now be invalid (passed) time. Check time again
      this.updateTime();
    } else {
      this.date = this.dateParser.convertDateToNgbDateStruct(new Date(this.selectedTime));
    }
  }

  updateTime(): void {
    let freeFrom: Date = new Date(this.selected.vehicle.freeFrom);
    if(!this.dateParser.isBeforeTime(freeFrom, this.date, this.time)) {
      this.time = this.dateParser.convertDateToNgbTimeStruct(new Date());
    }
    this.selectedTime = this.dateParser.parseTime(this.selectedTime, this.time);
    if (this.displayStops) console.log(this.selected.stops[0].departureTime);
    else console.log(this.selectedTime);
  }
}
