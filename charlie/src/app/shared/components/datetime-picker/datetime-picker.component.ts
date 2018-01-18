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
    this._model = model;
    // TODO init date time model
  }

  _model: Date;

  @Output()
  modelChanged: EventEmitter<Date> = new EventEmitter();

  time: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  date: NgbDateStruct = {year: 0, month: 0, day: 0};

  constructor(private converter: DateParserService) {
  }

  updateDate(): void {
    this.model = this.converter.parseNativeDate(this._model, this.date);
    this.modelChanged.emit(this._model);
  }

  updateTime(): void {
    this.model = this.converter.parseNativeTime(this._model, this.time);
    this.modelChanged.emit(this._model);
  }

}
