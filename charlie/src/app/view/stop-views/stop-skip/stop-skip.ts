import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {StopData} from '../../../shared/data/stop-data';
import {DateParserService} from '../../../services/date-parser.service';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {SkipData} from '../../../shared/data/skip-data';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './stop-skip.html',
  styleUrls: ['./stop-skip.css']
})

export class SkipStopComponent implements OnInit {
  @Input() @Output()
  data: StopData;

  saveDisabled: boolean = false;

  text: string = "";

  from: Date = new Date();
  to: Date = new Date();

  fromTime: NgbTimeStruct = {
    hour: this.from.getHours(),
    minute: this.from.getMinutes(),
    second: this.from.getSeconds()
  };
  fromDate: NgbDateStruct = {
    year: this.from.getFullYear(),
    month: this.from.getMonth() + 1,
    day: this.from.getDate()
  };
  toTime: NgbTimeStruct = {
    hour: this.to.getHours(),
    minute: this.to.getMinutes(),
    second: this.to.getSeconds()
  };
  toDate: NgbDateStruct = {
    year: this.to.getFullYear(),
    month: this.to.getMonth() + 1,
    day: this.to.getDate()};

  private callback: (param: StopData) => void;

  constructor(public activeModal: NgbActiveModal,
              public dateParser: DateParserService,
              public http: HttpRoutingService,
              private toastService: ToastService) {
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
    this.saveDisabled = true;
    let skipData: SkipData = new SkipData();
    skipData.reason = this.text;
    skipData.from = this.from;
    skipData.to = this.to;
    this.http.skipStop(this.data.id, skipData).subscribe(
      data => {
        this.data.skipData.push(data);
        this.toastService.showSuccessToast('Skipped stop ' + this.data.commonName);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to skip stop ' + this.data.commonName);
        this.saveDisabled = false;
      }
    );
  }

  textChange($event: Event) {
    console.log($event);
    this.text = (<HTMLTextAreaElement> $event.target).value;
  }
}
