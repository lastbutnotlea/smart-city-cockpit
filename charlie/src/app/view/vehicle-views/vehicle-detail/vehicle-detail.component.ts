import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {VehicleData} from '../../../shared/data/vehicle-data';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {TripData} from '../../../shared/data/trip-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {StopSortService} from '../../../services/stop-sort.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent extends LiveDataComponent implements OnInit {

  vehicle: VehicleData;
  loaded: boolean = false;
  feedback: FeedbackData[] = [];
  serviceRequests: ServiceRequestData[] = [];
  trips: TripData[] = [];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private toastService: ToastService,
              private stopSortService: StopSortService) {
    super();
  }

  ngOnInit(): void {
    super.subscribeToData();
  }

  getVehicleData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // vehicle data
    this.http.getVehicle(id).subscribe(
      vehicle => {
        this.vehicle = vehicle;
        this.loaded = true;
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load details of ' + id);
        console.log(JSON.stringify(err));
      });
    // trips for vehicle
    this.http.getTripsForVehicle(id).subscribe(
      trips => {
        this.trips = trips;
        this.trips.forEach(trip => trip.stops = this.stopSortService.sortStops(trip.stops));
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load trips for ' + id);
        console.log(JSON.stringify(err));
      });
    // feedback for vehicle
    this.http.getVehicleFeedback(id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load feedback for ' + id);
        console.log(JSON.stringify(err));
      });
    // service requests for vehicle
    this.http.getVehicleServiceRequests(id).subscribe(
      data => {
        this.serviceRequests = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load service requests for ' + id);
        console.log(JSON.stringify(err));
      });
  }

  goBack(): void {
    this.location.back();
  }

  delete(modal: NgbModalRef): void {
    this.http.deleteVehicle(this.vehicle.id).subscribe(
      data => {
        if (data.id === "Vehicle is in use!") {
          this.toastService.showErrorToast('Failed to delete ' + this.vehicle.id + ' because it has future trips.');
          modal.close('Close click');
          this.subscribeToData();
        } else {
          this.toastService.showSuccessToast('Deleted ' + this.vehicle.id);
          modal.close('Close click');
          this.goBack();
        }
      },
      err => {
        this.toastService.showErrorToast('Failed to delete ' + this.vehicle.id);
        modal.componentInstance.deleteDisabled = false;
        this.subscribeToData();
      }
    );
  }

  showConfirmModal(): void {
    super.unsubscribe();
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.delete(modal);
    });
    modal.componentInstance.closeEvent.subscribe(() => {
      // delete was not confirmed, request live-data again
      super.subscribeToData();
    })
  }

  // update trip data
  refreshData(): void {
    this.getVehicleData();
  }

}
