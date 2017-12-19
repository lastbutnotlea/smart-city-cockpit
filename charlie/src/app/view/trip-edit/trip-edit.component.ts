import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/line-data';
import {VehicleData} from '../../shared/vehicle-data';
import {StopData} from '../../shared/stop-data';
import {debug} from 'util';

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
      this.selected = new TripData;
      this.selected.line = Object.assign(new LineData(), this.data.line);
      this.selected.vehicle = Object.assign(new VehicleData(), this.data.vehicle);
      this.selected.stops = Object.assign(new Map<String, Date>(), this.data.stops);
    }
  }

  isChecked(stop: StopData): boolean {
    return this.data.stops.has(stop.id);
  }

  includeStop(stop: StopData, included: boolean): void {
    if (included) {
      this.selected.stops.set(stop.id, null);
    } else {
      console.log(this.selected.stops.delete(stop.id));
      console.log(this.selected.stops.clear());
    }
    console.log(JSON.stringify(this.selected.stops));

    const myMap = new Map();
    myMap.set('bar', 'foo');

    myMap.delete('bar');

    console.log(JSON.stringify(myMap));
  }
}
