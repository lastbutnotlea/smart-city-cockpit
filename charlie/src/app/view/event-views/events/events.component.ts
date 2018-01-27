import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../../shared/data/event-data';
import {EventAddComponent} from '../event-add/event-add.component';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {getUrlForId} from "../../../shared/util/routing-util";
import {Router} from "@angular/router";
import {FilterGroupComponent} from "../../../shared/components/filter-group/filter-group.component";

@Component({
  selector: 'app-event-view',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  title: String;
  loaded: boolean = false;

  events: EventData[] = [];

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

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
    this.router.navigate(["events/detail/" + id]);
  }
}
