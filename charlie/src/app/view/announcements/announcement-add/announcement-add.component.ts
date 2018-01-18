import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {now} from '../../../shared/data/dates';
import {DateParserService} from '../../../services/date-parser.service';
import {StopData} from '../../../shared/data/stop-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {LineData} from '../../../shared/data/line-data';
import {AnnouncementData} from '../../../shared/data/announcement-data';

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.css',
    '../../../shared/styling/global-styling.css']
})
export class AnnouncementAddComponent implements OnInit {
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

  availableStops: DropdownValue[] = [];
  selectedStop: DropdownValue = new DropdownValue(null, 'Select a stop');

  availableLines: DropdownValue[] = [];
  selectedLine: DropdownValue = new DropdownValue(null, 'Select a line');

  selectedStops: Set<StopData> = new Set();

  private callback: (param: AnnouncementData) => void;
  constructor(public activeModal: NgbActiveModal, public dateParser: DateParserService, public http: HttpRoutingService) {
  }

  ngOnInit() {
    this.http.getStops().subscribe(data => {
      data.sort((a, b) => a.commonName.localeCompare(b.commonName));
      this.availableStops = toDropdownItems(data, stop => stop.commonName + ' (' + stop.id + ')')
    }, err => alert(err));
    this.http.getLines().subscribe(data => this.availableLines = toDropdownItems(data, line => line.name),
      err => alert(err));

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

  addSelectedStop(): void {
    if (this.selectedStop.value != null) this.selectedStops.add(this.selectedStop.value);
  }

  addSelecedLine(): void {
    this.addSelecedLineInbound();
    this.addSelecedLineOutbound();
  }

  addSelecedLineInbound(): void {
    if (this.selectedLine.value != null)
      (<LineData> this.selectedLine.value).stopsInbound.forEach(stop => this.selectedStops.add(stop));
  }

  addSelecedLineOutbound(): void {
    if (this.selectedLine.value != null)
      (<LineData> this.selectedLine.value).stopsOutbound.forEach(stop => this.selectedStops.add(stop));
  }

  confirm(): void {
    let announcement: AnnouncementData = new AnnouncementData();
    announcement.text = this.text;
    announcement.stops = Array.from(this.selectedStops);
    announcement.validFrom = this.from;
    announcement.validTo = this.to;
    this.http.addAnnouncement(announcement).subscribe(
      data => {
        this.activeModal.close('Close click');
        announcement.id = data.id;
        this.callback(announcement);
      },
      err => alert('Could not edit trip.' + err)
    );
  }

  textChange($event: Event) {
    console.log($event);
    this.text = (<HTMLTextAreaElement> $event.target).value;
  }

  public onAdd(callback: (param: AnnouncementData) => void) {
    this.callback = callback;
  }
}
