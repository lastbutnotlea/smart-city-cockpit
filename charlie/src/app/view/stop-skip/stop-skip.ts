import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../services/http-routing.service';
import {now} from '../../shared/data/dates';
import {DateParserService} from '../../services/date-parser.service';
import {StopData} from '../../shared/data/stop-data';
import {SkipData} from "../../shared/data/SkipData";

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './stop-skip.html',
  styleUrls: ['./stop-skip.css', '../../shared/styling/global-styling.css']
})

export class SkipStopComponent implements OnInit {
  @Input() @Output()
  data: StopData;

  dataEdited: boolean = false;

  text: string = "";

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

  private callback: (param: StopData) => void;

  constructor(public activeModal: NgbActiveModal, public dateParser: DateParserService, public http: HttpRoutingService) {
  }

  ngOnInit(): void {
    this.updateTimes();
    console.log(this.fromTime);
    console.log(this.toTime);
  }

  updateTimes(): void {
    this.updateFromDate();
    this.updateFromTime();
    this.updateToDate();
    this.updateToTime();
  }

  updateFromTime(): void {
    if(!this.dateParser.isBeforeTime(new Date(), this.fromDate, this.fromTime)) {
      this.fromTime = this.dateParser.convertDateToNgbTimeStruct(new Date());
    }
    this.from = this.dateParser.parseNativeTime(this.from, this.fromTime);
  }

  updateFromDate(): void {
    if(this.dateParser.isBeforeDate(new Date(), this.fromDate)) {
      this.from = this.dateParser.parseNativeDate(this.from, this.fromDate);
      // Date might have been set to current date. Time could now be invalid (passed) time. Check time again
      this.updateFromTime();
    } else {
      this.fromDate = this.dateParser.convertDateToNgbDateStruct(this.from);
    }
  }

  updateToTime(): void {
    console.log(this.to.toISOString());
    if(!this.dateParser.isBeforeTime(new Date(this.from), this.toDate, this.toTime)) {
      this.toTime = this.dateParser.convertDateToNgbTimeStruct(new Date(this.from));
    }
    this.to = this.dateParser.parseNativeTime(this.to, this.toTime);
    console.log(this.to.toISOString());
  }

  updateToDate(): void {
    if(this.dateParser.isBeforeDate(this.from, this.toDate)) {
      this.to = this.dateParser.parseNativeDate(this.to, this.toDate);
      // Date might have been set to current date. Time could now be invalid (passed) time. Check time again
      this.updateToTime();
    } else {
      this.toDate = this.dateParser.convertDateToNgbDateStruct(this.from);
    }
  }

  confirm(): void {
    let skipData: SkipData = new SkipData();
    skipData.reason = this.text;
    skipData.from = this.from;
    skipData.to = this.to;
    debugger;
    this.http.skipStop(this.data.id, skipData).subscribe(
      data => {
        this.data.skipData.push(data);
        this.activeModal.close('Close click');
      },
      err => alert('Could not skip stop.' + err)
    );
  }

  textChange($event: Event) {
    console.log($event);
    this.text = (<HTMLTextAreaElement> $event.target).value;
  }
}
