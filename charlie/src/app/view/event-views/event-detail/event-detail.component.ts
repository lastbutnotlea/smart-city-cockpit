import {Component, OnInit} from '@angular/core';
import {EventData} from '../../../shared/data/event-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {EventEditComponent} from '../event-edit/event-edit.component';

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
              private modalService: NgbModal) {
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
      err => console.log('Could not fetch event data!')
    );
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
      this.deleteEvent($event);
    });
  }

  deleteEvent(event): void {
    this.http.deleteEvent(this.event.id).subscribe(
      data => {
        this.location.back();
      },
      err => {
        console.log('Could not delete event!');
      }
    );
  }

  isLoaded(): boolean {
    return this.event != null;
  }
}
