import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../shared/data/event-data';

@Component({
  selector: 'app-event-view',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css',
    '../../shared/styling/global-styling.css']
})

export class EventsComponent implements OnInit {
  title: String;

  events: EventData[] = [];

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) {
  }

  public ngOnInit(): void {
    this.title = 'Events';
    this.getEvents();
  }

  public isLoaded(): boolean {
    return (this.events.length > 0);
  }

  private getEvents(): void {
    this.http.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  addEvent(): void {
    // const modal = this.modalService.open(TripAddComponent);
    // modal.componentInstance.initData();
  }

  // update trips
  // refreshData(): void {
  //   this.setDataSubscription(
  //     this.http.getTrips().subscribe( data => {
  //         this.trips = data;
  //         this.subscribeToData();
  //       },
  //       err =>
  //         console.log('Could not fetch new line-data.')
  //     ));
  // }
}
