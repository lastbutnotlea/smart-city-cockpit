import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/line-data';
import {VehicleData} from '../../shared/vehicle-data';
import {StopData} from '../../shared/stop-data';
import { TripStopData } from '../../shared/trip-stop-data';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})

export class TripEditComponent implements OnInit {
  @Input() data: TripData;
  selected: TripData;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];

  constructor(public activeModal: NgbActiveModal, private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => this.availLines = data,
        err => console.log('Err'));

    this.http.getVehicles().subscribe(
      data => this.availVehicles = data,
      err => console.log('Err'));
  }

  confirm(): void {
    this.data.line = this.selected.line;
    this.data.vehicle = this.selected.vehicle;
    this.data.stops = this.selected.stops;
    console.log('Confirm trip editing: selected line: ' + this.data.line.id +
      ' selected vehicle: ' + this.data.vehicle.id + ' selected stops: ' + JSON.stringify(this.data.stops));
    this.activeModal.close('Close click');
    this.http.editTrip(this.data);
  }

  initData(): void {
    if (this.data != null) {
      // TODO: remove this if it is not needed!
      /*this.selected = new TripData;
      this.selected.line = Object.assign(new LineData(), this.data.line);
      this.selected.vehicle = Object.assign(new VehicleData(), this.data.vehicle);
      this.selected.stops = Object.assign(new Map<String, Date>(), this.data.stops);*/
      this.selected = this.data;
    }
  }

  isChecked(stop: StopData): boolean {
    // returns true if selected.stops contains one object with the id of stop
    return this.selected.stops.filter(tripStop => tripStop.stopId === stop.id).length === 1;
  }

  includeStop(stop: StopData, included: boolean): void {
    if (included) {
      debugger;
      this.selected.stops.push(new TripStopData(stop.id, -1));
    } else {
      debugger;
      this.selected.stops = this.selected.stops.filter(filteredStop => filteredStop.stopId !== stop.id);
    }
    console.log(JSON.stringify(this.selected.stops));
  }
}
