import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-timespan-picker',
  templateUrl: './timespan-picker.component.html',
  styleUrls: ['./timespan-picker.component.css']
})
export class TimespanPickerComponent {
  @Input()
  from: Date;
  @Output()
  fromChanged: EventEmitter<Date> = new EventEmitter<Date>();
  @Input()
  to: Date;
  @Output()
  toChanged: EventEmitter<Date> = new EventEmitter<Date>();
  @Input()
  textFrom: string = "Valid from: ";
  @Input()
  textTo: string = "Valid until: ";

  // holds the date that is current when the component is instantiated
  private reference: Date = new Date();

  isValidFrom: (Date) => boolean = (d: Date) => this.reference <= d;
  isValidTo: (Date) => boolean = (d: Date) => this.from <= d;

  onFromChange(newFrom: Date): void {
    this.from = newFrom;
    if (this.to < this.from) {
      // set 'to' to be equal to the new 'from'
      this.onToChange(this.from);
    }
    this.fromChanged.emit(this.from);
  }

  onToChange(newTo: Date): void {
    this.to = newTo;
    this.toChanged.emit(this.to);
  }
}
