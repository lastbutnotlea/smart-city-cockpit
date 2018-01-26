import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestEditComponent} from '../service-request-edit/service-request-edit.component';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {dummyDate} from '../../../shared/data/dates';

@Component({
  selector: 'app-service-request-detail-view',
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css']
})

export class ServiceRequestDetailComponent implements OnInit {

  title: string;
  serviceRequest: ServiceRequestData;
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private stringFormatter: StringFormatterService) {
  }

  ngOnInit(): void {
    this.title = "Service Request Detail View"
    this.getServiceRequest();
  }

  getServiceRequest(): void {
    const serviceRequestId = this.route.snapshot.paramMap.get('id');
    this.http.getServiceRequestDetails(serviceRequestId).subscribe(
      data => {
        this.serviceRequest = data;
        this.loaded = true;
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  editServiceRequest(): void {
    const modal = this.modalService.open(ServiceRequestEditComponent);
    modal.componentInstance.data = this.serviceRequest;
    modal.componentInstance.initData();
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = 'service request ' + this.serviceRequest.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteServiceRequest($event);});
  }

  deleteServiceRequest(event) : void {
    this.http.deleteServiceRequest(this.serviceRequest.id).subscribe(
      data => {
        this.location.back();
        console.log('Deleted successfully')
      },
      err => {
        console.log('Could not delete trip!');
      }
    );
  }

  hasVehicleTarget(){
    return this.serviceRequest.target.identifiableType === "vehicle";
  }

  hasStopTarget(){
    return this.serviceRequest.target.identifiableType === "stop";
  }

  hasTarget(){
    return this.serviceRequest.target !== null;
  }

  hasCompletionDate(serviceRequest: ServiceRequestData): boolean {
    return serviceRequest.completionDate !== dummyDate;
  }
}
