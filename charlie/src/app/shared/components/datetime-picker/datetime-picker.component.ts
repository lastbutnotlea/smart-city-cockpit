import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {DateParserService} from "../../../services/date-parser.service";

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
    this.time = this.converter.convertDateToNgbTimeStruct(this._model);
    this.date = this.converter.convertDateToNgbDateStruct(this._model);
    this.modelChanged.emit(this._model);
  }
  get model(): Date {
    return this._model;
  }

  @Input() isValid: (Date) => boolean = d => true;

  _model: Date;

  @Output()
  modelChanged: EventEmitter<Date> = new EventEmitter();

  time: NgbTimeStruct;// = this.converter.convertDateToNgbTimeStruct(this.model);
  date: NgbDateStruct;// = this.converter.convertDateToNgbDateStruct(this.model);

  constructor(private converter: DateParserService) {
  }

  updateDate(): void {
    this.model = this.converter.parseNativeDate(this.model, this.date);
  }

  updateTime(): void {
    this.model = this.converter.parseNativeTime(this.model, this.time);
  }

}
