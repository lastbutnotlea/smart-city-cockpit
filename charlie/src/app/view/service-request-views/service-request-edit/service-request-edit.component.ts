import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {ServiceRequestTarget} from '../../../shared/data/service-request-target';
import {
  DropdownValue, loadingDropdown,
  priorityDropdownItems, selectDropdown, toDropdownItem, toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {DateUtil} from '../../../shared/util/date-util';
import {ToastService} from '../../../services/toast.service';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {StopData} from '../../../shared/data/stop-data';

@Component({
  selector: 'app-service-request-add',
  templateUrl: './service-request-edit.component.html',
  styleUrls: ['./service-request-edit.component.css']
})

export class ServiceRequestEditComponent implements OnInit, OnDestroy {
  @Input() @Output()
  data: ServiceRequestData[];
  // stores data of the new service request
  selected: ServiceRequestData;
  title: string = "";

  targetTypeChosen: boolean = false;
  dataChosen: boolean = false;
  saveDisabled: boolean = false;
  targetEditable: boolean = true;
  typeEditable: boolean = true;
  dataEdited: boolean = false;

  selectedTargetType: DropdownValue = loadingDropdown;
  selectableTargetTypes: DropdownValue[];

  selectedTarget: DropdownValue = loadingDropdown;
  availTargets: ServiceRequestTarget[];
  selectedType: DropdownValue = loadingDropdown;
  selectedPriority: DropdownValue = loadingDropdown;
  description: string;
  selectedDate: string;
  date: NgbDateStruct;

  availFeedback: FeedbackData[];
  selectedFeedback: FeedbackData[];
  closeEvent = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private toastService: ToastService,
              private stringFormatter: StringFormatterService) { }

  ngOnInit(): void {
    this.selectableTargetTypes = this.targetItems();
    // if service request should be edited, use current data of service request as default data;
    if(this.dataEdited) {
      this.setPreviousData();
    } else {
      this.setInitialData();
    }
  }

  ngOnDestroy(): void {
    this.closeEvent.emit(true);
  }

  setPreviousData(): void {
    this.typeEditable = false;
    this.selected = this.data[0];
    this.title = "Edit service request " + this.selected.id;
    const value = this.selected.target.identifiableType === "vehicle";

    this.selectedTargetType =  new DropdownValue(value,
      this.selected.target.identifiableType.charAt(0).toUpperCase() + this.selected.target.identifiableType.slice(1).toLowerCase());
    this.getTargetOfSelectedTargetType();
    if(this.selectedTargetType.value){
      this.selectedTarget = toDropdownItem(this.selected.target, item => item.id);
    } else {
      this.selectedTarget = toDropdownItem(this.selected.target,
        item =>this.stringFormatter.toStopId(<StopData> item));
    }
    this.selectedType = new DropdownValue(this.selected.serviceType,
      this.stringFormatter.toFirstUpperRestLower(this.selected.serviceType));
    this.selectedPriority = new DropdownValue(this.selected.priority,
      this.stringFormatter.priorityToLabel(this.selected.priority));

    this.date = DateUtil.convertDateToNgbDateStruct(new Date(this.selected.dueDate));
    this.updateDate();
    if (this.selected.serviceRequestDescription.length != 0) {
      this.description = this.selected.serviceRequestDescription[0].text;
    }
    this.selectedFeedback = [];
    this.selected.feedbacks.forEach(feedback => {
      this.selectedFeedback.push(Object.assign(new FeedbackData(), feedback));
    });
  }

  setInitialData(): void {
    this.title = "Add new service request";
    this.selected = new ServiceRequestData();
    this.selected.feedbacks = [];
    // set selectable values
    if(this.targetEditable) {
      this.selectedTargetType = selectDropdown;
    }
    this.selectedType = selectDropdown;
    this.selectedPriority = selectDropdown;
    this.description = "";

    this.selectedDate = DateUtil.cutTimezoneInformation(new Date());
    this.date = {year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate()};
    this.updateDate();
    this.selectedFeedback = [];
  }

  /**
   * Creates DropdownValue for each possible target-type
   * @returns {DropdownValue[]}
   */
  targetItems(): DropdownValue[] {
    if(this.targetEditable){
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
    // if type of selected target corresponds to selected target type,
    // getting possible targets from backend is not necessary because we already have them
    if(!this.hasValidType()){
      // get all vehicle targets
      if(this.selectedTargetType.value) {
        this.http.getVehicles().subscribe(data => {
            this.targetTypeChosen = true;
            this.setTargetData(data);
          },
          err => {
            this.toastService.showLastingErrorToast(
              'Failed to load vehicle targets. Please try reloading the page');
            console.log(JSON.stringify(err));
          });
        //get all stop targets
      } else if (!this.selectedTargetType.value) {
        this.http.getStops().subscribe(data => {
            this.targetTypeChosen = true;
            this.setTargetData(data);
          },
          err => {
            this.toastService.showLastingErrorToast(
              'Failed to load stop targets. Please try reloading the page');
            console.log(JSON.stringify(err));
          });
      }
      // if we don't need to get new data from backend, just set targetTypeChosen to true
    } else {
      this.targetTypeChosen = true;
    }
  }

  setTargetData(data: ServiceRequestTarget[]): void {
    this.availTargets = data;
    if(!this.hasValidType()) {
      this.selectedTarget = selectDropdown;
      if (this.dataEdited) {
        this.selectedFeedback = [];
      }
    }
    this.targetTypeChosen = true;
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
      }, err => {
        this.toastService.showLastingErrorToast(
          'Failed to load feedback for selected vehicle target. Please try reloading the page');
        console.log(JSON.stringify(err));
      });
    } else if(!this.selectedTargetType.value) {
      this.http.getStopFeedback(this.selectedTarget.value.id).subscribe( data => {
        this.availFeedback = data;
        this.dataChosen = true;
      }, err => {
        this.toastService.showLastingErrorToast(
          'Failed to load feedback for selected stop target. Please try reloading the page');
        console.log(JSON.stringify(err));
      });
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
    this.selected.feedbacks = this.selectedFeedback;
    this.removeFeedbackOfDifferentTargets();
    if(this.dataEdited) {
      this.sendEditRequest();
    } else {
      this.sendAddRequest();
    }
  }

  sendAddRequest(): void {
    this.selected.serviceRequestDescription = [{"id": "", "text": this.description, "objectId": ""}];
    this.http.addServiceRequest(this.selected).subscribe(
      data => {
        console.log('Added service request.');
        this.callback(data);
        this.toastService.showSuccessToast('Added service request ' + data.id);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to add service request');
        console.log(JSON.stringify(err));
        this.saveDisabled = false;
      }
    );
  }

  removeFeedbackOfDifferentTargets() {
    // get rid of all feedback that belongs to other targets
    this.selected.feedbacks = this.selected.feedbacks.filter(feedback =>
      feedback.objective.id === this.selected.target.id);
  }

  sendEditRequest(): void {
    this.selected.name = null;
    this.selected.serviceRequestDescription[0].text = this.description;
    this.http.editServiceRequest(this.selected).subscribe(
      data => {
        this.callback(data);
        console.log('Edited service request.');
        this.toastService.showSuccessToast('Edited service request ' + data.id);
        this.activeModal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to edit service request');
        console.log(JSON.stringify(err));
      }
    );
  }

  toDropdownItemsTarget(items: ServiceRequestTarget[]): DropdownValue[] {
    if(this.selectedTargetType.value){
      return toDropdownItems(items, item => item.id);
    } else {
      return toDropdownItems(items, item => this.stringFormatter.toStopId(<StopData>item));
    }
  }

  typeItems(): DropdownValue[] {
    let typeItems: DropdownValue[] = [];
    typeItems.push(new DropdownValue('CLEANING', 'Cleaning'));
    typeItems.push(new DropdownValue('MAINTENANCE', 'Maintenance'));
    return typeItems;
  }

  priorityItems(): DropdownValue[] {
    return priorityDropdownItems();
  }

  updateDate(): void {
    if(DateUtil.isBeforeDate(new Date(), this.date)) {
      this.selectedDate = DateUtil.parseDate(
        this.selectedDate,
        this.date
      );
    } else {
      this.date = DateUtil.convertDateToNgbDateStruct(new Date(this.selectedDate));
    }
  }

  isChecked(feedback: FeedbackData) {
    return this.selectedFeedback.find(f => f.id === feedback.id);
  }

  includeFeedback(feedback: FeedbackData) {
    if(this.isChecked(feedback)){
      this.selectedFeedback = this.selectedFeedback.filter(f => f.id !== feedback.id);
    } else {
      this.selectedFeedback.push(feedback);
    }
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
      this.selectedTarget =  toDropdownItem(target, item => item.id);
    } else {
      this.selectedTargetType = new DropdownValue(false, 'Stop');
      this.selectedTarget =  toDropdownItem(target, item => this.stringFormatter.toStopId(<StopData> item));
    }
    // set target
    this.availTargets = [target];
    // set state of add-window
    this.targetTypeChosen = true;
    this.targetEditable = false;
  }

  public editData(): void {
    this.dataEdited = true;
  }

  public disableNext(): boolean {
    if(!this.targetTypeChosen
      && (this.selectedTargetType !== selectDropdown)
      && (this.selectedTargetType !== loadingDropdown)){
      return false;
    } else if (this.targetTypeChosen
      && !this.dataChosen
      && (this.selectedTarget !== selectDropdown)
      && (this.selectedTarget !== loadingDropdown)
      && (this.selectedType !== selectDropdown)
      && (this.selectedType !== loadingDropdown)
      && (this.selectedPriority !== selectDropdown)
      && (this.selectedPriority !== loadingDropdown)){
      return false;
    } else if (this.dataChosen && !this.saveDisabled){
      return false;
    }
    return true;
  }

  hasValidType(): boolean {
    if(this.selectedTarget.value !== null) {
      if(this.selectedTarget.value.identifiableType === this.selectedTargetType.label.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  isValidDueDate(date: Date): boolean{
    return date > new Date();
  }
}
