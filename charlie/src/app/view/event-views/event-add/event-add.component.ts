import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {now} from '../../../shared/data/dates';
import {DateParserService} from '../../../services/date-parser.service';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {EventData} from '../../../shared/data/event-data';
import {PartyData} from '../../../shared/data/party-data';
import {C4CNotes} from '../../../shared/data/c4c-notes';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {
  data: EventData[];

  subject: string = "";

  availablePriorities: Array<DropdownValue> = [];
  priority: DropdownValue = new DropdownValue('FINE', 'Low');

  from: string = now.toISOString();
  to: string = now.toISOString();

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

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue = new DropdownValue(null, 'loading');

  notes: string = "";

  constructor(public activeModal: NgbActiveModal,
              public dateParser: DateParserService,
              public http: HttpRoutingService) {
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      this.party = toDropdownItem(data[0], party => party);
      this.availableParties = toDropdownItems(data, party => party)
    }, err => console.log(err));

    this.availablePriorities = toDropdownItems(
      ['FINE', 'PROBLEMATIC', 'CRITICAL'],
      item => item.toLowerCase());

    this.updateFromDate();
    this.updateFromTime();
    this.updateToDate();
    this.updateToTime();
  }

  updateFromTime(): void {
    this.from = this.dateParser.parseTime(this.from, this.fromTime);
  }

  updateFromDate(): void {
    this.from = this.dateParser.parseDate(this.from, this.fromDate);
  }

  updateToTime(): void {
    this.to = this.dateParser.parseTime(this.to, this.toTime);
  }

  updateToDate(): void {
    this.to = this.dateParser.parseDate(this.to, this.toDate);
  }

  confirm(): void {
    let event: EventData = new EventData();
    event.id = '';
    event.subject = this.subject;
    event.priority = this.priority.value;
    event.startTime = this.from;
    event.endTime = this.to;
    event.appointmentInvolvedParties = new Array(new PartyData('', this.party.value, ''));
    let notesC4C: C4CNotes = new C4CNotes;
    notesC4C.id = '';
    notesC4C.text = this.notes;
    event.appointmentNotes = new Array(notesC4C);
    console.log(event);
    this.http.addEvent(event).subscribe(
      data => {
        console.log('Added event.')
        this.data.push(data);
        this.activeModal.close('Close click');
      },
      err => alert('Could not add event.' + err)
    );
  }
}
