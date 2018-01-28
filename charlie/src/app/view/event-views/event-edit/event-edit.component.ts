import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../../shared/data/event-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue, priorityDropdownItems, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {DateParserService} from '../../../services/date-parser.service';
import {PartyData} from '../../../shared/data/party-data';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ToastService} from '../../../services/toast.service';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})

export class EventEditComponent implements OnInit {
  @Input() @Output()
  data: EventData;

  selected: EventData;

  availablePriorities: Array<DropdownValue> = [];
  priority: DropdownValue = new DropdownValue(null, 'loading');

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
  saveDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              public dateParser: DateParserService,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
  }


  initData(): void {
    if (this.data != null) {
      this.selected = new EventData();
      this.selected.subject = this.data.subject;
      this.selected.priority = this.data.priority;

      this.selected.startTime = this.data.startTime;
      this.fromDate = this.dateParser.convertDateToNgbDateStruct(new Date(this.selected.startTime));
      this.fromTime = this.dateParser.convertDateToNgbTimeStruct(new Date(this.selected.startTime));

      this.selected.endTime = this.data.endTime;
      this.toDate = this.dateParser.convertDateToNgbDateStruct(new Date(this.selected.endTime));
      this.toTime = this.dateParser.convertDateToNgbTimeStruct(new Date(this.selected.endTime));

      this.selected.appointmentInvolvedParties = [];
      for (const party of this.data.appointmentInvolvedParties) {
        this.selected.appointmentInvolvedParties.push(party);
      }

      this.selected.appointmentNotes = [];
      for (const note of this.data.appointmentNotes) {
        this.selected.appointmentNotes.push(note);
      }

      this.party = toDropdownItem(this.selected.appointmentInvolvedParties[0], party => party.partyName);
      this.priority = toDropdownItem(this.selected.priority, item => this.stringFormatter.priorityToLabel(item));
    }
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      console.log(data);
      this.availableParties = toDropdownItems(data, party => party)
    }, err => console.log(err));
    this.availablePriorities = priorityDropdownItems();

    console.log(this.fromTime);
    console.log(this.toTime);
  }

  updateFromTime(): void {
    this.selected.startTime = this.dateParser.parseTime(this.selected.startTime, this.fromTime);
  }

  updateFromDate(): void {
    this.selected.startTime = this.dateParser.parseDate(this.selected.startTime, this.fromDate);
  }

  updateToTime(): void {
    this.selected.endTime = this.dateParser.parseTime(this.selected.endTime, this.toTime);
  }

  updateToDate(): void {
    this.selected.endTime = this.dateParser.parseDate(this.selected.endTime, this.toDate);
  }

  confirm(): void {
    this.saveDisabled = true;
    this.data.subject = this.selected.subject;
    this.data.priority = this.priority.value;
    this.data.startTime = this.selected.startTime;
    this.data.endTime = this.selected.endTime;
    this.data.appointmentInvolvedParties = new Array(
      new PartyData(this.data.appointmentInvolvedParties[0].id, this.party.value,
        this.data.appointmentInvolvedParties[0].objectId));
    this.data.appointmentNotes = this.selected.appointmentNotes;

    this.http.editEvent(this.data).subscribe(
      data => {
        this.activeModal.close('Close click');
        this.toastService.showSuccessToast('Edited event ' + data.id);
        console.log('Received for Edit: ' + data)
      },
      err => {
        this.toastService.showErrorToast('Failed to edit event ' + this.data.id);
        this.saveDisabled = false;
      }
    );
  }
}
