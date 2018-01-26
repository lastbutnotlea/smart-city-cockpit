import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.css']
})

export class ConfirmDeletionComponent implements OnInit {
  @Input() objectToDelete: String;
  @Output() deletionEvent = new EventEmitter<boolean>();
  deleteDisabled: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.deleteDisabled = true;
    this.deletionEvent.emit(true);
    this.activeModal.close('Close click');
  }
}
