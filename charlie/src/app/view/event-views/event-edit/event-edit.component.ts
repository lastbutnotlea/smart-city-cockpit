import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../../shared/data/event-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue, loadingDropdown, priorityDropdownItems, selectDropdown, toDropdownItem,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {PartyData} from '../../../shared/data/party-data';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ToastService} from '../../../services/toast.service';
import {C4CNotes} from "../../../shared/data/c4c-notes";
import {DateUtil} from "../../../shared/util/date-util";

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  @Input() @Output()
  data: EventData;

  id: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  appointmentInvolvedParties: PartyData[];
  appointmentNotes: C4CNotes[];

  availablePriorities: Array<DropdownValue> = [];
  priority: DropdownValue = loadingDropdown;

  availableParties: Array<DropdownValue> = [];
  party: DropdownValue = loadingDropdown;

  saveDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
  }

  initData(): void {
    this.subject = this.data.subject;
    this.startTime = new Date(this.data.startTime);
    this.endTime = new Date(this.data.endTime);
    this.appointmentInvolvedParties = [];
    for (const party of this.data.appointmentInvolvedParties) {
      this.appointmentInvolvedParties.push(party);
    }
    this.appointmentNotes = [];
    for (const note of this.data.appointmentNotes) {
      this.appointmentNotes.push(Object.assign(new C4CNotes(), note));
    }
  }

  ngOnInit() {
    this.http.getInvolvedParties().subscribe(data => {
      this.availableParties = toDropdownItems(data, party => party);
      if (this.availableParties.some(p => p.label === this.appointmentInvolvedParties[0].partyName)) {
        this.party = toDropdownItem(this.appointmentInvolvedParties[0], party => party.partyName);
      } else {
        this.party = selectDropdown;
      }
    }, err => {
      this.toastService.showErrorToast('Failed to get the available parties');
      console.log('Failed to get the available parties: ' + JSON.stringify(err));
    });
    this.availablePriorities = priorityDropdownItems();
    if (this.availablePriorities.some(p => p.label === this.stringFormatter.priorityToLabel(this.data.priority))) {
      this.priority = toDropdownItem(this.data.priority, item => this.stringFormatter.priorityToLabel(item));
    } else {
      this.priority = selectDropdown;
    }
  }

  isConfirmEnabled(): boolean {
    return !this.saveDisabled
      && this.subject !== ''
      && this.priority.value !== null
      && this.party.value !== null
      && this.appointmentInvolvedParties.length > 0
      && this.appointmentInvolvedParties[0] !== null
      && this.appointmentNotes.length > 0
      && this.appointmentNotes[0] !== null
      && this.appointmentNotes[0].text !== null
      && this.appointmentNotes[0].text !== '';
  }

  confirm(): void {
    this.saveDisabled = true;
    let model = new EventData();
    this.fillEventWithData(model);

    this.http.editEvent(model).subscribe(
      data => {
        this.activeModal.close('Close click');
        this.toastService.showSuccessToast('Edited event ' + data.id);
        console.log('Received for Edit Event: ' + data);
        this.fillEventWithData(this.data);
      },
      err => {
        this.toastService.showErrorToast('Failed to edit event ' + this.data.id);
        console.log("Could not save changes: " + JSON.stringify(err));
        this.saveDisabled = false;
      }
    );
  }

  private fillEventWithData(event: EventData) {
    event.subject = this.subject;
    event.priority = this.priority.value;
    event.startTime = DateUtil.cutTimezoneInformation(this.startTime);
    event.endTime = DateUtil.cutTimezoneInformation(this.endTime);
    event.appointmentInvolvedParties = new Array(
      new PartyData(this.appointmentInvolvedParties[0].id,
        this.party.value,
        this.appointmentInvolvedParties[0].objectId));
    event.appointmentNotes = this.appointmentNotes;
  }
}
