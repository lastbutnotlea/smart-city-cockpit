import {Component, OnInit} from '@angular/core';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripEditComponent} from '../trip-edit/trip-edit.component';
import {ConfirmDeletionComponent} from '../../shared/components/confirm-popup/confirm-deletion.component';



@Component({
  selector: 'app-trip-detail-view',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css', '../../shared/styling/embedded-components.css',
              '../../shared/styling/global-styling.css']
})

export class TripDetailComponent implements OnInit {

  trip: TripData;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getTrip();
  }

  getTrip(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    this.http.getTripDetails(tripId).subscribe(
      trip => {
        this.trip = trip;
      },
      err => console.log('Could not fetch trip data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  edit(): void {
    const modal = this.modalService.open(TripEditComponent);
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
    this.http.deleteTrip(this.trip.id).subscribe(
      data => this.location.back(),
      err => console.log("Could not delete trip."));
  }

  isLoaded(): boolean {
    return this.trip != null;
  }

}
