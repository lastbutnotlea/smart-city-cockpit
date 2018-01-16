import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../shared/data/event-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {C4CNotes} from '../../shared/data/c4c-notes';
import {DropdownValue, toDropdownItem, toDropdownItems} from '../../shared/components/dropdown/dropdown.component';
import {now} from '../../shared/data/dates';
import {DateParserService} from '../../services/date-parser.service';
import {PartyData} from '../../shared/data/party-data';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css',
              '../../shared/styling/global-styling.css']
})

export class EventEditComponent implements OnInit {
  @Input() @Output() data: EventData;

  selected: EventData;

  availablePriorities: Array<DropdownValue> = [];
  priority: DropdownValue = new DropdownValue('FINE', 'fine');

  fromTime: NgbTimeStruct = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
  fromDate: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  toTime: NgbTimeStruct = {hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds()};
  toDate: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue = new DropdownValue(null, 'loading');

  // selectedVehicle: DropdownValue;
  //
  // availLines: LineData[] = [];
  // availVehicles: VehicleData[] = [];

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              public dateParser: DateParserService) { }


  initData(): void {
    if (this.data != null) {
      this.selected = new EventData();
      this.selected.subject = this.data.subject;
      this.selected.priority = this.data.priority;
      this.selected.startTime = this.data.startTime;
      this.selected.endTime = this.data.endTime;
      this.selected.appointmentInvolvedParties = [];
      for(const party of this.data.appointmentInvolvedParties) {
        this.selected.appointmentInvolvedParties.push(party);
      }
      this.selected.appointmentNotes = [];
      let allNotes = '';
      for(const note of this.data.appointmentNotes) {
        allNotes += note.text;
      }
      let newC4CNote = new C4CNotes();
      newC4CNote.id = '';
      newC4CNote.text = allNotes;
      this.selected.appointmentNotes.push(newC4CNote);

      this.party = toDropdownItem(this.selected.appointmentInvolvedParties[0], party => party.partyName);
      this.priority = toDropdownItem(this.selected.priority, item => item.toLowerCase());
    }
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      this.availableParties = toDropdownItems(data, party => party)
    }, err => alert(err));

    this.http.getInvolvedParties().subscribe(data => {
      console.log(data);
    }, err => alert(err));


    this.availablePriorities = toDropdownItems(
      ['FINE', 'PROBLEMATIC', 'CRITICAL'],
      item => item.toLowerCase());

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
    this.data.subject = this.selected.subject;
    this.data.priority = this.priority.value;
    this.data.startTime = this.selected.startTime;
    this.data.endTime = this.selected.endTime;
    this.data.appointmentInvolvedParties = new Array(new PartyData('', this.party.value));
    this.data.appointmentNotes = this.selected.appointmentNotes;

    this.activeModal.close('Close click');
    this.http.editEvent(this.data).subscribe(
      data => {
        // get event details to refresh event detail data in event detail view
        this.http.getEventDetails(this.data.id).subscribe(
          event => {

            //waruuum muss ich das machen? vgl. trip-edit
            //stehen in data nicht automatisch die richtigen daten drin???

            this.selected.subject = event.subject;
            this.selected.priority = event.priority;
            this.selected.startTime = this.data.startTime;
            this.selected.endTime = this.data.endTime;
            this.selected.appointmentInvolvedParties = [];
            for(const party of this.data.appointmentInvolvedParties) {
              this.selected.appointmentInvolvedParties.push(party);
            }
            this.selected.appointmentNotes = [];
            let allNotes = '';
            for(const note of this.data.appointmentNotes) {
              allNotes += note.text;
            }
            let newC4CNote = new C4CNotes();
            newC4CNote.id = '';
            newC4CNote.text = allNotes;
            this.selected.appointmentNotes.push(newC4CNote);



            // copy new data into data object
            this.data.line = Object.assign(new LineData(), trip.line);
            this.data.vehicle = Object.assign(new VehicleData, trip.vehicle);
            this.data.stops = [];
            for(const stop of trip.stops) {
              this.data.stops.push(stop);
            }
            this.data.stops = this.stopSortService.sortStops(this.data.stops);
          },
          err => console.log('Could not fetch event data!')
        );
      },
      err => console.log('Could not edit event.')
    );
  }

  subjectChange($event: Event) {
    this.selected.subject = (<HTMLTextAreaElement> $event.target).value;
  }

  notesChange($event: Event) {
    this.selected.appointmentNotes[0].text = (<HTMLTextAreaElement> $event.target).value;
  }
}
