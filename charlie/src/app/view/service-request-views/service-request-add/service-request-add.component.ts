import {Component, Input, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {ServiceRequestTarget} from '../../../shared/data/service-request-target';
import {DropdownValue, priorityDropdownItems} from '../../../shared/components/dropdown/dropdown.component';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {now} from '../../../shared/data/dates';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DateParserService} from '../../../services/date-parser.service';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-service-request-add',
  templateUrl: './service-request-add.component.html',
  styleUrls: ['./service-request-add.component.css']
})

export class ServiceRequestAddComponent implements OnInit {
  @Input() @Output()
  data: ServiceRequestData[];
  // stores data of the new service request
  selected: ServiceRequestData;

  targetTypeChosen: boolean = false;
  dataChosen: boolean = false;
  saveDisabled: boolean = false;
  targetEditable: boolean = true;

  selectedTargetType: DropdownValue;

  selectedTarget: DropdownValue;
  availTargets: ServiceRequestTarget[];
  selectedType: DropdownValue;
  selectedPriority: DropdownValue;
  description: string;
  selectedDate: string = now.toISOString();
  date: NgbDateStruct;

  availFeedback: FeedbackData[];
  selectedFeedback: FeedbackData[];

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private dateParser: DateParserService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.selected = new ServiceRequestData();
    this.selected.feedbacks = [];

    // TODO: Get data from meta data controller, do not set manually
    if(this.targetEditable) {
      this.selectedTargetType = new DropdownValue(true, 'Vehicle');
    }
    this.selectedType = new DropdownValue('CLEANING', 'Cleaning');
    this.selectedPriority = new DropdownValue('FINE', 'Low');
    this.description = "";

    this.date = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.updateDate();

    this.selectedFeedback = []
  }

  /**
   * Creates DropdownValue for each possible target-type
   * @returns {DropdownValue[]}
   */
  targetItems(): DropdownValue[] {
    if(this.targetEditable){
      // TODO: Get data from meta data controller, do not set manually ?
      let targetItems: DropdownValue[] = [];
      targetItems.push(new DropdownValue(true, 'Vehicle'));
      targetItems.push(new DropdownValue(false, 'Stop'));
      return targetItems;
    }
    return [this.selectedTargetType];
  }

  /**
   * Executes next step in Add-process
   * (first choose target type,
   * then select target, priority, date and add description,
   * finally choose feedback and send new object to backend)
   */
  confirm(): void{
    if(!this.targetTypeChosen){
      this.getTargetOfSelectedTargetType();
    } else if(!this.dataChosen) {
      this.getFeedbackForSelectedTarget();
    } else {
      this.addServiceRequest();
    }
  }

  /**
   * Target type (stop or vehicle) has been selected
   * Now get all possible targets of that type from backend
   */
  getTargetOfSelectedTargetType() {
    // get all available objects of selected target type
    if(this.selectedTargetType.value && this.targetEditable){
      this.http.getVehicles().subscribe(data => {
        this.availTargets = data;
        this.selectedTarget = this.toDropdownItemTarget(this.availTargets[0]);
        this.targetTypeChosen = true;
      },
      err => console.log('Could not load vehicle targets.'));
    } else if(!this.selectedTargetType.value && this.targetEditable){
      this.http.getStops().subscribe(data => {
          this.availTargets = data;
          this.selectedTarget = this.toDropdownItemTarget(this.availTargets[0]);
          this.targetTypeChosen = true;
        },
        err => console.log('Could not load vehicle targets.'));
    } else {
      // target has already been selected and is not editable
      this.targetTypeChosen = true;
    }
  }

  /**
   * Target has been chosen
   * now get all feedback for that target so that feedback can be added to service request
   */
  getFeedbackForSelectedTarget() {
    if(this.selectedTargetType.value){
      this.http.getVehicleFeedback(this.selectedTarget.value.id).subscribe( data => {
        this.availFeedback = data;
        this.dataChosen = true;
      }, err => console.log('Could not load feedback for vehicle.'));
    } else if(!this.selectedTargetType.value) {
      this.http.getStopFeedback(this.selectedTarget.value.id).subscribe( data => {
        this.availFeedback = data;
        this.dataChosen = true;
      }, err => console.log('Could not load feedback for vehicle.'));
    }
  }

  /**
   * adds service request with selected data
   */
  addServiceRequest() {
    this.saveDisabled = true;
    this.selected.target = this.selectedTarget.value;
    this.selected.serviceType = this.selectedType.value;
    this.selected.priority = this.selectedPriority.value;
    this.selected.dueDate = this.selectedDate;
    this.selected.serviceRequestDescription = [{"id": "", "text": this.description, "objectId": ""}];
    console.log(this.selected);

    this.http.addServiceRequest(this.selected).subscribe(
      data => {
        console.log('Added service request.');
        this.callback(data);
        this.toastService.showSuccessToast('Added service request ' + data.id);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to add service request');
        console.log('Could not add service request.');
      }
    );
  }

  toDropdownItemTarget(item: ServiceRequestTarget): DropdownValue {
    return new DropdownValue(item, item.id);
  }

  toDropdownItemsTarget(items: ServiceRequestTarget[]): DropdownValue[] {
    return items.map(item => this.toDropdownItemTarget(item));
  }

  typeItems(): DropdownValue[] {
    // TODO: Get data from meta data controller, do not set manually
    let typeItems: DropdownValue[] = [];
    typeItems.push(new DropdownValue('CLEANING', 'Cleaning'));
    typeItems.push(new DropdownValue('MAINTENANCE', 'Maintenance'));
    return typeItems;
  }

  priorityItems(): DropdownValue[] {
    return priorityDropdownItems();
  }

  updateDate(): void {
    if(this.dateParser.isBeforeDate(new Date(), this.date)) {
      this.selectedDate = this.dateParser.parseDate(
        this.selectedDate,
        this.date
      );
    } else {
      this.date = this.dateParser.convertDateToNgbDateStruct(new Date(this.selectedDate));
    }
  }

  isChecked(feedback: FeedbackData) {
    return this.selectedFeedback.filter(feedback => feedback.id === feedback.id).length === 1;
  }

  includeFeedback(feedback: FeedbackData, included: boolean) {
    if (included) {
      this.selected.feedbacks.push(feedback);
    } else {
      this.selected.feedbacks = this.selected.feedbacks.filter(filteredFeedback =>
        filteredFeedback.id !== feedback.id);
    }
    console.log(JSON.stringify(this.selected.feedbacks));
  }

  stepBack() {
    if(this.dataChosen){
      this.dataChosen = false;
    } else if(this.targetTypeChosen) {
      this.targetTypeChosen = false;
    }
  }

  private callback: (param: ServiceRequestData) => void = () => {
  };

  public onAdd(callback: (param: ServiceRequestData) => void) {
    this.callback = callback;
  }

  public skipSteps(isVehicleTarget: boolean, target: ServiceRequestTarget): void {
    // set target type
    if(isVehicleTarget){
      this.selectedTargetType = new DropdownValue(true, 'Vehicle');
    } else {
      this.selectedTargetType = new DropdownValue(false, 'Stop');
    }
    // set target
    this.availTargets = [target];
    this.selectedTarget = this.toDropdownItemTarget(target);
    // set state of add-window
    this.targetTypeChosen = true;
    this.targetEditable = false;
  }
}
