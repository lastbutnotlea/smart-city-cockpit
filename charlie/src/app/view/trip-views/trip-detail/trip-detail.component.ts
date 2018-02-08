import {Component, OnInit} from '@angular/core';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {TripData} from '../../../shared/data/trip-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {StopSortService} from '../../../services/stop-sort.service';
import {TripEditComponent} from '../trip-edit/trip-edit.component';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {Location} from '@angular/common';
import {ToastService} from '../../../services/toast.service';

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
              private stopSortService: StopSortService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
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
      err => {
        this.toastService.showLastingErrorToast('Failed to load details of ' + tripId);
        console.log(JSON.stringify(err));
      });
  }

  goBack(): void {
    this.location.back();
  }

  edit(): void {
    const modal = this.modalService.open(TripEditComponent);
    modal.componentInstance.setModel(this.trip);
    modal.componentInstance.initData();
  }

  showConfirmModal(): void {
    super.unsubscribe();
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = this.trip.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteTrip(modal);
    });
    modal.componentInstance.closeEvent.subscribe(() => {
      // delete was not confirmed, request live-data again
      super.subscribeToData();
    })
  }

  deleteTrip(modal: NgbModalRef): void {
    super.unsubscribe();
    this.http.deleteTrip(this.trip.id).subscribe(
      () => {
        this.toastService.showSuccessToast('Deleted ' + this.trip.id);
        modal.close('Close click');
        this.location.back();
      },
      err => {
        this.toastService.showErrorToast('Failed to delete ' + this.trip.id);
        modal.componentInstance.deleteDisabled = false;
        super.subscribeToData();
      });
  }

  // update trip data
  refreshData(): void {
    this.getTrip();
  }

}
