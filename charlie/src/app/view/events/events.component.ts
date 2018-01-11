import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpRoutingService } from '../../services/http-routing.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-view',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css',
    '../../shared/styling/global-styling.css']
})

export class EventsComponent implements OnInit {
  title: String;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal) {
  }

  public ngOnInit(): void {
    this.title = 'Events';
    this.getEvents();
  }

  public isLoaded(): boolean {
    // if (this.trips.length > 0) {
    //   return true;
    // }
    // return false;
    return true;
  }

  private getEvents(): void {

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
