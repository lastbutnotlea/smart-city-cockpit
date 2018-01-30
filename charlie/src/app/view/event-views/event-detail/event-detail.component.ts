import {Component, OnInit} from '@angular/core';
import {EventData} from '../../../shared/data/event-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {EventEditComponent} from '../event-edit/event-edit.component';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-event-detail-view',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  title: string;

  event: EventData;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.title = 'Details Event';
    this.getEvent();
  }

  getEvent(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.http.getEventDetails(eventId).subscribe(
      event => {
        this.event = event;
      },
      err => {
        this.toastService.showLastingErrorToast(
          'Failed to load event details of event ' + eventId + '. Please reload the page');
        console.log(JSON.stringify(err));
      });
  }

  goBack(): void {
    this.location.back();
  }

  editEvent(): void {
    const modal = this.modalService.open(EventEditComponent);
    modal.componentInstance.data = this.event;
    modal.componentInstance.initData();
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = 'event ' + this.event.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteEvent(modal);
    });
  }

  deleteEvent(modal: NgbModalRef): void {
    this.http.deleteEvent(this.event.id).subscribe(
      () => {
        this.toastService.showSuccessToast('Deleted event ' + this.event.id);
        modal.close('Close click');
        this.location.back();
      },
      err => {
        this.toastService.showErrorToast('Failed to delete event ' + this.event.id);
        console.log(JSON.stringify(err));
        modal.componentInstance.deleteDisabled = false;
      }
    );
  }

  isLoaded(): boolean {
    return this.event != null;
  }
}
