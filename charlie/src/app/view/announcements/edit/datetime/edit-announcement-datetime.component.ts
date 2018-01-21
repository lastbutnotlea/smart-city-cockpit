import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-edit-announcement-datetime',
  templateUrl: './edit-announcement-datetime.component.html',
  styleUrls: ['./edit-announcement-datetime.component.css']
})
export class EditAnnouncementDatetimeComponent {
  @Input()
  from: Date;
  @Output()
  fromChanged: EventEmitter<Date> = new EventEmitter<Date>();
  @Input()
  to: Date;
  @Output()
  toChanged: EventEmitter<Date> = new EventEmitter<Date>();

  isValidFrom: (Date) => boolean = (d: Date) => new Date() <= d;
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
