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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
    this.getVehicleData();
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
      err => console.log('Could not fetch vehicle data!')
    );
    // trips for vehicle
    this.http.getTripsForVehicle(id).subscribe(
      trips => {
        this.trips = trips;
        this.trips.forEach(trip => trip.stops = this.stopSortService.sortStops(trip.stops));
      },
      err => console.log('Could not fetch trip data, sorry!')
    );
    // feedback for vehicle
    this.http.getVehicleFeedback(id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        console.log(JSON.stringify(err));
      }
    );
    // service requests for vehicle
    this.http.getVehicleServiceRequests(id).subscribe(
      data => {
        this.serviceRequests = data;
      }, err => {
        console.log('Could not get Service Requests for Stop')
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  delete(): void {
    this.http.deleteVehicle(this.vehicle.id).subscribe(
      () => {
        this.toastService.showSuccessToast('Deleted ' + this.vehicle.id);
        this.goBack();
      },
      () => {
        this.toastService.showErrorToast('Failed to delete ' + this.vehicle.id);
      }
    );
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = this.vehicle.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.delete();
    });
  }

  // update trip data
  refreshData(): void {
    this.getVehicleData();
  }

}
