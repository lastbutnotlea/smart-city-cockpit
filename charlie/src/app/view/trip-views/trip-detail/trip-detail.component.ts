import {Component, OnInit} from '@angular/core';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {TripData} from '../../../shared/data/trip-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StopSortService} from '../../../services/stop-sort.service';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {Location} from '@angular/common';
import {TripAddComponent} from "../trip-add/trip-add.component";

@Component({
  selector: 'app-trip-detail-view',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})

export class TripDetailComponent extends LiveDataComponent implements OnInit {

  trip: TripData;
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private stopSortService: StopSortService) {
    super();
  }

  ngOnInit(): void {
    this.getTrip();
    super.subscribeToData();
  }

  getTrip(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    this.http.getTripDetails(tripId).subscribe(
      trip => {
        this.trip = trip;
        this.trip.stops = this.stopSortService.sortStops(this.trip.stops);
        this.loaded = true;
      },
      err => console.log('Could not fetch trip data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  edit(): void {
    const modal = this.modalService.open(TripAddComponent);
    modal.componentInstance.setModel(this.trip);
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

  // update trip data
  refreshData(): void {
    this.getTrip();
  }

}
