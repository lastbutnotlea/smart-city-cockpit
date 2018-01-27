import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateParserService} from '../../../services/date-parser.service';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue, priorityDropdownItems, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {EventData} from '../../../shared/data/event-data';
import {PartyData} from '../../../shared/data/party-data';
import {C4CNotes} from '../../../shared/data/c4c-notes';
import {ToastService} from '../../../services/toast.service';

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

  from: string = (new Date()).toISOString();
  to: string = (new Date()).toISOString();

  fromTime: NgbTimeStruct = {
    hour: (new Date()).getHours(),
    minute: (new Date()).getMinutes(),
    second: (new Date()).getSeconds()
  };
  fromDate: NgbDateStruct = {
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    day: (new Date()).getDate()
  };
  toTime: NgbTimeStruct = {
    hour: (new Date()).getHours(),
    minute: (new Date()).getMinutes(),
    second: (new Date()).getSeconds()
  };
  toDate: NgbDateStruct = {year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate()};

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue = new DropdownValue(null, 'loading');

  notes: string = "";
  saveDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              public dateParser: DateParserService,
              public http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      this.party = toDropdownItem(data[0], party => party);
      this.availableParties = toDropdownItems(data, party => party)
    }, err => console.log(err));

    this.availablePriorities = priorityDropdownItems();

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
    this.saveDisabled = true;
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
        console.log('Added event.');
        this.toastService.showSuccessToast('Added event ' + data.id);
        this.data.push(data);
        this.activeModal.close('Close click');
      },
      err => this.toastService.showErrorToast('Failed to add event')
    );
  }
}
