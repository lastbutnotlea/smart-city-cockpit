import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/data/line-data';
import {VehicleData} from '../../shared/data/vehicle-data';
import {StopData} from '../../shared/data/stop-data';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {StopSortService} from '../../services/stop-sort.service';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css',  '../../shared/styling/global-styling.css']
})

export class TripAddComponent implements OnInit {
  selected: TripData;

  selectedVehicle: DropdownValue;
  selectedLine: DropdownValue;
  selectedDirection: DropdownValue;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];

  date: NgbDateStruct;
  time: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private stopSortService: StopSortService) { }

  ngOnInit(): void {
    this.selectedVehicle = new DropdownValue(0, 'loading');
    this.selectedLine = new DropdownValue(0, 'loading');
    this.selectedDirection = this.directionItem();
  }

  initData(): void {
    this.http.getLines().subscribe(
      data => {
        this.availLines = data;
        this.selectedLine = this.toDropdownItemL(this.availLines[0]);
      },
      err => console.log('Err'));

    this.http.getVehicles().subscribe(
      data => {
        this.availVehicles = data;
        this.selectedVehicle = this.toDropdownItemV(this.availVehicles[0]);
      },
      err => console.log('Err'));

    this.selected = new TripData();
  }

  showStops(): void {
    this.selected.vehicle = this.selectedVehicle.value;
    this.selected.line = this.selectedLine.value;
    this.selected.isInbound = this.selectedDirection.value;

    let stops = [];
    let selectedStops = [];
    if(this.selectedDirection.value) {
      selectedStops = this.selected.line.stopsInbound;
    }
    else {
      selectedStops = this.selected.line.stopsOutbound;
    }
    for(const stop of selectedStops) {
      stops.push(new TripStopData(stop.id, '0000-01-01T00:00', stop.commonName));
    }
    debugger;

    this.selected.stops = stops;
    console.log("show stops works");
  }

  stopsVisible(): boolean {
    return this.selected.stops !== null;
  }

  confirm(): void {
    this.activeModal.close('Close click');
    this.http.addTrip(this.selected).subscribe(
      data => {
        // get trips to refresh the trip detail data in trip detail view
        this.http.getTripDetails(this.selected.id).subscribe(
          trip => {
            // copy new data into data object
            this.selected.line = Object.assign(new LineData(), trip.line);
            this.selected.vehicle = Object.assign(new VehicleData, trip.vehicle);
            this.selected.stops = [];
            for(const stop of trip.stops) {
              this.selected.stops.push(stop);
            }
            this.selected.stops = this.stopSortService.sortStops(this.selected.stops);
          },
          err => console.log('Could not fetch trip data!')
        );
      },
      err => console.log('Could not edit trip.')
    );
  }

  isChecked(stop: StopData): boolean {
    // returns true if selected.stops contains one object with the id of stop
    return this.selected.stops.filter(tripStop => tripStop.id === stop.id).length === 1;
  }

  includeStop(stop: StopData, included: boolean): void {
    if (included) {
      this.selected.stops.push(new TripStopData(stop.id, '0000-01-01T00:00', ''));
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
    return new DropdownValue(item, item.id);
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
}
