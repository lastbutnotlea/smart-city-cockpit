import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {now} from '../../shared/data/dates';
import {DateParserService} from '../../services/date-parser.service';
import {HttpRoutingService} from '../../services/http-routing.service';
import {DropdownValue, toDropdownItem, toDropdownItems} from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {
  subject: string = "";

  availablePriorities: Array<DropdownValue> = [];
  priority: DropdownValue;

  from: Date = new Date(now);
  to: Date = new Date(now);

  fromTime: NgbTimeStruct = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
  fromDate: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  toTime: NgbTimeStruct = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
  toDate: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};

  locationName: string = "";

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue;

  notes: string = "";

  constructor(public activeModal: NgbActiveModal,
              public dateParser: DateParserService,
              public http: HttpRoutingService) {
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      this.availableParties = toDropdownItems(data, party => party.partyName)
    }, err => alert(err));

    this.priority = toDropdownItem('FINE', () => 'fine');
    this.availablePriorities = toDropdownItems(
      ['FINE', 'PROBLEMATIC', 'CRITICAL'],
      item => item.toLowerCase());

    this.updateFromDate();
    this.updateFromTime();
    this.updateToDate();
    this.updateToTime();
    console.log(this.fromTime);
    console.log(this.toTime);
  }

  updateFromTime(): void {
    this.from = this.dateParser.parseNativeTime(this.from, this.fromTime);
  }

  updateFromDate(): void {
    this.from = this.dateParser.parseNativeDate(this.from, this.fromDate);
  }

  updateToTime(): void {
    console.log(this.to.toISOString());
    this.to = this.dateParser.parseNativeTime(this.to, this.toTime);
    console.log(this.to.toISOString());
  }

  updateToDate(): void {
    this.to = this.dateParser.parseNativeDate(this.to, this.toDate);
  }

  addSelectedStop(): void {
    // this.selectedStops.push(this.selectedStop.value);
  }



  confirm(): void {
    // let announcement: AnnouncementData = new AnnouncementData();
    // announcement.text = this.text;
    // announcement.stops = this.selectedStops;
    // announcement.validFrom = this.from;
    // announcement.validTo = this.to;
    // this.http.addAnnouncement(announcement).subscribe(
    //   data => this.activeModal.close('Close click'),
    //   err => alert('Could not edit trip.' + err)
    // );
  }

  subjectChange($event: Event) {
    this.subject = (<HTMLTextAreaElement> $event.target).value;
  }

  locationNameChange($event: Event) {
    this.locationName = (<HTMLTextAreaElement> $event.target).value;
  }

  notesChange($event: Event) {
    this.notes = (<HTMLTextAreaElement> $event.target).value;
  }
}
