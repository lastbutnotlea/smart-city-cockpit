import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {DateUtil} from "../../util/date-util";

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.css']
})
export class DatetimePickerComponent {
  @Input()
  text: string = "";

  @Input()
  set model(model: Date) {
    if (this.isValid(model)) {
      this._model = model;
    }
    this.time = DateUtil.convertDateToNgbTimeStruct(this._model);
    this.date = DateUtil.convertDateToNgbDateStruct(this._model);
    this.modelChanged.emit(this._model);
  }

  get model(): Date {
    return this._model;
  }

  @Input() isValid: (Date) => boolean = d => true;

  _model: Date = new Date();

  @Output()
  modelChanged: EventEmitter<Date> = new EventEmitter();

  time: NgbTimeStruct;
  date: NgbDateStruct;

  updateDate(): void {
    this.model = DateUtil.parseNativeDate(this.model, this.date);
  }

  updateTime(): void {
    this.model = DateUtil.parseNativeTime(this.model, this.time);
  }

}
