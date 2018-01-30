import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue, loadingDropdown, priorityDropdownItems, selectDropdown, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {EventData} from '../../../shared/data/event-data';
import {PartyData} from '../../../shared/data/party-data';
import {C4CNotes} from '../../../shared/data/c4c-notes';
import {ToastService} from '../../../services/toast.service';
import {DateParserService} from "../../../services/date-parser.service";

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {
  callback: (EventData) => void = e => {};

  subject: string = "";

  availablePriorities: Array<DropdownValue> = priorityDropdownItems();
  priority: DropdownValue = this.availablePriorities[0];

  fromDate: Date = new Date();
  toDate: Date = new Date();

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue = loadingDropdown;

  notes: string = "";
  saveDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              public http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(
      data => {
        this.party = selectDropdown;
        this.availableParties = toDropdownItems(data, party => party)
      }, err => {
        console.log("Could not load available parties: " + JSON.stringify(err));
        this.toastService.showErrorToast("Could not load available parties.");
      });
  }

  public onAddCallback(callback: (EventData) => void) {
    this.callback = callback;
  }

  confirm(): void {
    this.saveDisabled = true;
    let event: EventData = new EventData();
    event.id = '';
    event.subject = this.subject;
    event.priority = this.priority.value;
    event.startTime = DateParserService.cutTimezoneInformation(this.fromDate);
    event.endTime = DateParserService.cutTimezoneInformation(this.toDate);
    event.appointmentInvolvedParties = new Array(new PartyData('', this.party.value, ''));
    let notesC4C: C4CNotes = new C4CNotes;
    notesC4C.id = '';
    notesC4C.text = this.notes;
    event.appointmentNotes = new Array(notesC4C);
    this.http.addEvent(event).subscribe(
      data => {
        console.log('Added event: ' + JSON.stringify(event));
        this.toastService.showSuccessToast('Added event ' + data.id);
        this.callback(data);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to add event');
        console.log("Could not create event: \nError: " + JSON.stringify(err) + "\nFor event: " + JSON.stringify(event));
        this.saveDisabled = false;
      });
  }
}
