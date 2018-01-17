import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {DateParserService} from '../../services/date-parser.service';
import {StopSortService} from '../../services/stop-sort.service';
import {VehicleData} from '../../shared/data/vehicle-data';
import {LineData} from '../../shared/data/line-data';
import {dummyDate, now} from '../../shared/data/dates';

@Component({
  selector: 'app-trip-edit-departure',
  templateUrl: './trip-edit-departure.component.html',
  styleUrls: ['./trip-edit-departure.component.css',
              '../../shared/styling/global-styling.css']
})

export class TripEditDepartureComponent implements OnInit {
  @Input() @Output() data: TripData;

  selectedStop: DropdownValue;
  copiedStops: TripStopData[];
  date: NgbDateStruct;
  time: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService,
              private stopSortService: StopSortService) { }

  ngOnInit(): void {
    this.time = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
    this.date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  initData(): void {
    if (this.data.stops != null) {
      this.copiedStops = [];
      for(const stop of this.data.stops) {
        this.copiedStops.push(Object.assign(new TripStopData(
          stop.id,
          stop.departureTime,
          stop.name,
          stop.state
        )));
      }
      this.selectedStop = this.toDropdownItem(this.copiedStops[0]);
    }
  }

  confirm(): void {
    for(const stop of this.data.stops) {
      if(stop.id != this.selectedStop.value.id) {
        stop.departureTime = dummyDate;
      }
      else {
        stop.departureTime = this.selectedStop.value.departureTime;
      }
        console.log(stop.departureTime);
    }

    this.activeModal.close('Close click');
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
          },
          err => console.log('Could not fetch trip data!')
        );
      },
      err => console.log('Could not edit trip.')
    );
  }

  toDropdownItem(item: TripStopData): DropdownValue {
    return new DropdownValue(item, item.name);
  }

  toDropdownItems(items: TripStopData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItem(item));
  }

  updateDate(): void {
    if(this.dateParser.checkValidDate(this.date)) {
      this.selectedStop.value.departureTime = this.dateParser.parseDate(
        this.selectedStop.value.departureTime, this.date);
      this.updateTime();
    } else {
      this.date = this.dateParser.parseStringToNgbDateStruct(this.selectedStop.value.departureTime);
    }
    console.log(this.selectedStop.value.departureTime);
  }

  updateTime(): void {
    if(this.dateParser.checkValidTime(this.date, this.time)) {
      this.selectedStop.value.departureTime = this.dateParser.parseTime(
        this.selectedStop.value.departureTime, this.time);
    } else {
      this.time = this.dateParser.parseDateToNgbTimeStruct(new Date());
    }
    console.log(this.selectedStop.value.departureTime);
  }
}
