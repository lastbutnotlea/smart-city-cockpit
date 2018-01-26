import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../shared/data/event-data';
import {EventAddComponent} from '../event-add/event-add.component';
import {getUrlForId} from "../../shared/util/routing-util";
import {Router} from "@angular/router";

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
              private modalService: NgbModal,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.title = 'Events';
    this.getEvents();
    this.loaded = true;
  }

  private getEvents(): void {
    this.http.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  addEvent(): void {
    const modal = this.modalService.open(EventAddComponent);
    modal.componentInstance.data = this.events;
  }

  goToLink(id: string): void {
    let link: string = getUrlForId(id);
    this.router.navigate([link]);
  }
}
