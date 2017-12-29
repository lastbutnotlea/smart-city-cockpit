import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import {forEach} from '@angular/router/src/utils/collection';
import {DateParserService} from '../../services/date-parser.service';

@Component({
  selector: 'app-trip-edit-departure',
  templateUrl: './trip-edit-departure.component.html',
  styleUrls: ['./trip-edit-departure.component.css',  '../../shared/styling/global-styling.css']
})

export class TripEditDepartureComponent implements OnInit {
  @Input() data: TripData;

  selectedStop: DropdownValue;
  copiedStops: TripStopData[];
  date: NgbDateStruct;
  time: NgbTimeStruct;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) { }

  ngOnInit(): void {
    this.time = {hour: 0, minute: 0, second: 0};
  }

  confirm(): void {
    for(const stop of this.data.stops) {
      if(stop.id != this.selectedStop.value.id) {
        //                   dummy date
        stop.departureTime = '0000-01-01T00:00';
      }
      else {
        stop.departureTime = this.selectedStop.value.departureTime;
      }
        console.log(stop.departureTime);
    }

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
    this.selectedStop.value.departureTime = this.dateParser.parseDate(
      this.selectedStop.value.departureTime,
      this.date
    );
    console.log(this.selectedStop.value.departureTime);
  }

  updateTime(): void {
    this.selectedStop.value.departureTime = this.dateParser.parseTime(
      this.selectedStop.value.departureTime,
      this.time
    );
    console.log(this.selectedStop.value.departureTime);
  }
}
