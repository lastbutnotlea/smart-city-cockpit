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
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { ServiceRequestData } from '../../shared/data/service-request-data';



@Component({
  selector: 'app-service-request-detail-view',
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css',
              '../../shared/styling/embedded-components.css',
              '../../shared/styling/global-styling.css']
})

export class ServiceRequestComponent extends LiveDataComponent implements OnInit {

  serviceRequest: ServiceRequestData;
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private stopSortService: StopSortService) {
    super();
  }

  ngOnInit(): void {
    this.getServiceRequest();
  }

  getServiceRequest(): void {
    const serviceRequestId = this.route.snapshot.paramMap.get('id');
    this.http.getServiceRequestDetails(serviceRequestId).subscribe(
      data => {
        this.serviceRequest = data;
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
      },
      err => console.log('Could not fetch trip data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  editServiceRequest(): void {
    // TODO: open edit component once available
    /*const modal = this.modalService.open(ServiceRequestEditComponent);
    modal.componentInstance.data = this.serviceRequest;
    modal.componentInstance.initData();*/
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = 'trip ' + this.serviceRequest.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteServiceRequest($event);});
  }

  deleteServiceRequest(event) : void {
    super.ngOnDestroy();
    this.http.deleteServiceRequest(this.serviceRequest.id).subscribe(
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
    this.setDataSubscription(
      this.http.getServiceRequestDetails(this.serviceRequest.id).subscribe( data => {
          this.serviceRequest = data;
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }

}
