import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.css']
})

export class ConfirmDeletionComponent implements OnDestroy {
  @Input() objectToDelete: String;
  @Output() deletionEvent = new EventEmitter<boolean>();
  @Output() closeEvent = new EventEmitter<boolean>();
  deleteDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnDestroy(): void {
    this.closeEvent.emit(false);
  }

  confirm(): void {
    this.deleteDisabled = true;
    this.deletionEvent.emit(true);
  }
}
