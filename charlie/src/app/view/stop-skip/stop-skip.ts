import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../services/http-routing.service';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';
import { ServiceRequestData } from '../../shared/data/service-request-data';
import { now } from '../../shared/data/dates';
import { DateParserService } from '../../services/date-parser.service';
import { FeedbackData } from '../../shared/data/feedback-data';
import { VehicleData } from '../../shared/data/vehicle-data';
import { StopData } from '../../shared/data/stop-data';
import {SkipData} from "../../shared/data/SkipData";

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './stop-skip.html',
  styleUrls: ['./stop-skip.css',  '../../shared/styling/global-styling.css']
})

export class StopSkipComponent implements OnInit {
  @Input() @Output()
  data: StopData;

  dataEdited: boolean = false;

  skipData: SkipData;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) { }

  from: Date = new Date(now);
  to: Date = new Date(now);

  fromTime: NgbTimeStruct = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };
  fromDate: NgbDateStruct = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
  toTime: NgbTimeStruct = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };
  toDate: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};

  ngOnInit(): void {
  }

  confirm(): void {

  }

  stepBack() {
    if(this.dataEdited){
      this.dataEdited = false;
    }
  }
}
