import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../../shared/data/event-data';
import {EventAddComponent} from '../event-add/event-add.component';

@Component({
  selector: 'app-event-view',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  title: String;
  loaded: boolean = false;

  events: EventData[] = [];

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) {
  }

  public ngOnInit(): void {
    this.title = 'Events';
    this.getEvents();
  }

  private getEvents(): void {
    this.http.getEvents().subscribe(data => {
      this.events = data;
      this.loaded = true;
    });
  }

  addEvent(): void {
    const modal = this.modalService.open(EventAddComponent);
    modal.componentInstance.data = this.events;
  }
}
