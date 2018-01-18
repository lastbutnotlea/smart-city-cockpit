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

  constructor() {
  }

  onFromChange(): void {
    this.fromChanged.emit(this.from);
  }

  onToChange(): void {
    this.toChanged.emit(this.to);
  }
}
