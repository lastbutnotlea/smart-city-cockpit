import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-trip-edit-departure',
  templateUrl: './trip-edit-departure.component.html',
  styleUrls: ['./trip-edit-departure.component.css',  '../../shared/styling/global-styling.css']
})

export class TripEditDepartureComponent implements OnInit {
  @Input() data: TripData;

  selectedStop: DropdownValue;
  copiedStops: TripStopData[];
  model: NgbDateStruct;
  time: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.time = {hour: 0, minute: 0, second: 0};
  }

  confirm(): void {
   // this.data.vehicle = this.selectedVehicle.value;
    this.activeModal.close('Close click');
    this.http.editTrip(this.data);
  }

  initData(): void {
    if (this.data.stops != null) {
      this.copiedStops = [];
      for(const stop of this.data.stops) {
        this.copiedStops.push(Object.assign(new TripStopData(
          stop.id,
          stop.departureTime,
          stop.name
        )));
      }
      for(let stop of this.copiedStops) {
        stop.departureTime = stop.departureTime;
      }
      this.selectedStop = this.toDropdownItem(this.copiedStops[0]);
    }
  }

  toDropdownItem(item: TripStopData): DropdownValue {
    return new DropdownValue(item, item.name);
  }

  toDropdownItems(items: TripStopData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItem(item));
  }

  updateDate(): void {
    let currentDate = new Date(this.selectedStop.value.departureTime);
    currentDate.setUTCFullYear(this.model.year);
    currentDate.setUTCMonth(this.model.month - 1);
    currentDate.setUTCDate(this.model.day);
    currentDate.setHours(currentDate.getHours() + 1);

    let newDate = currentDate.toISOString();
    newDate = newDate.substr(0, newDate.length - 2);
    this.selectedStop.value.departureTime = newDate;
    console.log(this.selectedStop.value.departureTime);
  }

  updateTime(): void {
    let currentDate = new Date(this.selectedStop.value.departureTime);
    currentDate.setUTCHours(this.time.hour);
    currentDate.setUTCMinutes(this.time.minute);

    let newDate = currentDate.toISOString();
    newDate = newDate.substr(0, newDate.length - 2);
    this.selectedStop.value.departureTime = newDate;
    console.log(this.selectedStop.value.departureTime);
  }
}
