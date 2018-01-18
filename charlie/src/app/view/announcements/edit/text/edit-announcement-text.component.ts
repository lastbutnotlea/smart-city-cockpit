import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-edit-announcement-text',
  templateUrl: './edit-announcement-text.component.html',
  styleUrls: ['./edit-announcement-text.component.css']
})
export class EditAnnounementTextComponent {
  @Output() textChange = new EventEmitter<string>();
  @Input() text: string;

  constructor() {
  }

  onTextChange(event: Event): void {
    this.textChange.emit(this.text);
  }
}
