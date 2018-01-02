import {Component, OnInit} from '@angular/core';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripEditComponent} from '../trip-edit/trip-edit.component';
import {ConfirmDeletionComponent} from '../../shared/components/confirm-popup/confirm-deletion.component';
import {StopSortService} from '../../services/stop-sort.service';
import {TripEditDepartureComponent} from '../trip-edit-departure/trip-edit-departure.component';
import { GeneralizedComponent } from '../../shared/components/generalized/generalized.component';



@Component({
  selector: 'app-trip-detail-view',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css',
              '../../shared/styling/embedded-components.css',
              '../../shared/styling/global-styling.css']
})

export class TripDetailComponent extends GeneralizedComponent implements OnInit {

  trip: TripData;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private stopSortService: StopSortService) {
    super();
  }

  ngOnInit(): void {
    this.getTrip();
  }

  getTrip(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    this.http.getTripDetails(tripId).subscribe(
      trip => {
        this.trip = trip;
        this.trip.stops = this.stopSortService.sortStops(this.trip.stops);
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
      },
      err => console.log('Could not fetch trip data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  editStops(): void {
    const modal = this.modalService.open(TripEditComponent);
    modal.componentInstance.data = this.trip;
    modal.componentInstance.initData();
  }

  editDepartureTime(): void {
    const modal = this.modalService.open(TripEditDepartureComponent);
    modal.componentInstance.data = this.trip;
    modal.componentInstance.initData();
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = 'trip ' + this.trip.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteTrip($event);});
  }

  deleteTrip(event) : void {
    super.ngOnDestroy();
    this.http.deleteTrip(this.trip.id).subscribe(
      data => this.location.back(),
      err => {
        // Currently, when deleting a trip, we get a http-response with http-code 200 (ok)
        // This means deleting the trip was successful
        // http-response is interpreted as error, therefore the message must be checked here, not in data
        // TODO: http-response should not always be considered an error / backend should return different value?
        if(err.status === 200){
          this.location.back();
        } else {
          console.log('Could not delete trip!');
          this.refreshData();
        }
      }
    );
  }

  isLoaded(): boolean {
    return this.trip != null;
  }

  // update trip data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getTripDetails(this.trip.id).subscribe( data => {
          this.trip = data;
          this.trip.stops = this.stopSortService.sortStops(this.trip.stops);
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }

}
