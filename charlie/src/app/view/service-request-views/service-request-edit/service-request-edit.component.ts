import {Component, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {DropdownValue} from '../../../shared/components/dropdown/dropdown.component';
import {now} from '../../../shared/data/dates';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DateParserService} from '../../../services/date-parser.service';

@Component({
  selector: 'app-service-request-edit',
  templateUrl: './service-request-edit.component.html',
  styleUrls: ['./service-request-edit.component.css']
})

export class ServiceRequestEditComponent {
  @Input() @Output()
  data: ServiceRequestData;

  dataEdited: boolean = false;

  selectedPriority: DropdownValue;
  description: string;
  selectedDate: string = now.toISOString();
  date: NgbDateStruct;
  availFeedback: FeedbackData[];
  selectedFeedback: FeedbackData[];

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService) {
  }

  initData(): void {
    if (this.data != null) {
      this.selectedPriority = new DropdownValue(this.data.priority, this.data.priority);
      if (this.data.serviceRequestDescription.length != 0) {
        this.description = this.data.serviceRequestDescription[0].text;
      }
      this.selectedDate = this.data.dueDate;
      this.date = this.dateParser.convertDateToNgbDateStruct(new Date(this.selectedDate));
      this.selectedFeedback = [];
      for (let feedback of this.data.feedbacks) {
        this.selectedFeedback.push(feedback);
      }
    }
  }

  confirm(): void {
    if (!this.dataEdited) {
      this.getFeedbackForTarget();
    } else {
      this.editServiceRequest();
    }
  }

  getFeedbackForTarget(): void {
    if (this.data.target.identifiableType === "vehicle") {
      this.http.getVehicleFeedback(this.data.target.id).subscribe(data => {
        this.availFeedback = data;
        this.dataEdited = true;
      }, err => console.log('Could not load feedback for vehicle.'));
    } else if (this.data.target.identifiableType === "stop") {
      this.http.getStopFeedback(this.data.target.id).subscribe(data => {
        this.availFeedback = data;
        this.dataEdited = true;
      }, err => console.log('Could not load feedback for vehicle.'));
    } else {
      console.log('No Target for service request ' + this.data.id);
      this.availFeedback = [];
      this.dataEdited = true;
    }
  }

  editServiceRequest(): void {
    this.data.priority = this.selectedPriority.value;
    this.data.dueDate = this.selectedDate;
    this.data.serviceRequestDescription = [{"id": "", "text": this.description, "objectId": this.data.serviceRequestDescription[0].objectId}];
    this.data.feedbacks = this.selectedFeedback;
    console.log(this.data);

    this.http.editServiceRequest(this.data).subscribe(
      data => {
        console.log('Added service request.');
        this.activeModal.close('Close click');
      },
      err => {
        console.log('Could not add service request.');
        this.activeModal.close('Close click');
      });
  }

  isChecked(feedback: FeedbackData): boolean {
    return this.selectedFeedback.filter(filteredFeedback => filteredFeedback.id === feedback.id).length === 1;
  }

  includeFeedback(feedback: FeedbackData, included: boolean): void {
    if (included) {
      this.selectedFeedback.push(feedback);
    } else {
      this.selectedFeedback = this.selectedFeedback.filter(filteredFeedback =>
        filteredFeedback.id !== feedback.id);
    }
    console.log(JSON.stringify(this.selectedFeedback));
  }

  /**
   * Only use selected date if it is not passed already
   */
  updateDate(): void {
    if (this.dateParser.isBeforeDate(new Date(), this.date)) {
      this.selectedDate = this.dateParser.parseDate(this.selectedDate, this.date);
    } else {
      this.date = this.dateParser.convertDateToNgbDateStruct(new Date(this.selectedDate));
    }
  }

  priorityItems(): DropdownValue[] {
    // TODO: Get data from meta data controller, do not set manually
    let prioItems: DropdownValue[] = [];
    prioItems.push(new DropdownValue('FINE', 'Low'));
    prioItems.push(new DropdownValue('PROBLEMATIC', 'Medium'));
    prioItems.push(new DropdownValue('CRITICAL', 'High'));
    return prioItems;
  }

  stepBack() {
    if (this.dataEdited) {
      this.dataEdited = false;
    }
  }
}
