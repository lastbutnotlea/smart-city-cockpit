import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../../shared/data/event-data';
import {EventAddComponent} from '../event-add/event-add.component';
import {Router} from "@angular/router";
import {FilterGroupComponent} from "../../../shared/components/filter-group/filter-group.component";
import {ToastService} from '../../../services/toast.service';

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
              private router: Router,
              private toastService: ToastService) {
  }

  public ngOnInit(): void {
    this.title = 'Events';
    this.getEvents();
  }

  private getEvents(): void {
    this.http.getEvents().subscribe(data => {
      this.events = data;
      this.loaded = true;
    }, err => {
      this.toastService.showLastingErrorToast(
        'Failed to load events. Please try reloading the page');
      console.log(JSON.stringify(err));
    });
  }

  addEvent(): void {
    const modal = this.modalService.open(EventAddComponent);
    modal.componentInstance.onAddCallback(e => this.events.push(e));
  }

  goToLink(id: string): void {
    this.router.navigate(["events/detail/" + id]);
  }
}
