import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/data/line-data';
import {VehicleData} from '../../shared/data/vehicle-data';
import {StopData} from '../../shared/data/stop-data';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {StopSortService} from '../../services/stop-sort.service';
import {dummyDate} from '../../shared/data/dates';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})

export class TripEditComponent implements OnInit {
  @Input() @Output() data: TripData;
  selected: TripData;

  selectedVehicle: DropdownValue;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private stopSortService: StopSortService) { }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => this.availLines = data,
        err => console.log('Err'));

    this.http.getVehicles().subscribe(
      data => this.availVehicles = data,
      err => console.log('Err'));
  }

  initData(): void {
    if (this.data != null) {
      this.selected = new TripData;
      this.selected.line = Object.assign(new LineData(), this.data.line);
      this.selected.vehicle = Object.assign(new VehicleData(), this.data.vehicle);
      this.selected.stops = [];
      for (const stop of this.data.stops) {
        this.selected.stops.push(stop);
      }

      this.selectedVehicle = this.toDropdownItem(this.selected.vehicle);
    }
  }

  confirm(): void {
    this.data.vehicle = this.selectedVehicle.value;
    this.data.stops = this.selected.stops;
    this.http.editTrip(this.data).subscribe(
      data => {
        // get trips to refresh the trip detail data in trip detail view
        this.http.getTripDetails(this.data.id).subscribe(
          trip => {
            // copy new data into data object
            this.data.line = Object.assign(new LineData(), trip.line);
            this.data.vehicle = Object.assign(new VehicleData, trip.vehicle);
            this.data.stops = [];
            for(const stop of trip.stops) {
              this.data.stops.push(stop);
            }
            this.data.stops = this.stopSortService.sortStops(this.data.stops);
            this.activeModal.close('Close click');
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
      this.selected.stops.push(new TripStopData(stop.id, dummyDate, stop.commonName, stop.state));
    } else {
      this.selected.stops = this.selected.stops.filter(filteredStop => filteredStop.id !== stop.id);
      this.selected.stops = this.stopSortService.sortStops(this.selected.stops);
    }
    console.log(JSON.stringify(this.selected.stops));
  }

  toDropdownItem(item: VehicleData): DropdownValue {
    return new DropdownValue(item, item.id);
  }

  toDropdownItems(items: VehicleData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItem(item));
  }
}
