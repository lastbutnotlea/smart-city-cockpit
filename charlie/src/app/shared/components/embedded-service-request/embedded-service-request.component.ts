import {Component, Input} from '@angular/core';
import { ServiceRequestData } from '../../data/service-request-data';
import {ServiceRequestEditComponent} from '../../../view/service-request-views/service-request-edit/service-request-edit.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestTarget} from '../../data/service-request-target';

@Component({
  selector: 'app-embedded-service-requests',
  templateUrl: 'embedded-service-request.component.html',
  styleUrls: []
})

export class EmbeddedServiceRequestComponent{

  @Input() serviceRequests: ServiceRequestData[] = [];
  @Input() target: ServiceRequestTarget;

  constructor(private modalService: NgbModal,) {
  }

  hasOpenRequests(): boolean {
    return this.serviceRequests.filter(data => this.isOpenRequest(data)).length !== 0;
  }

  hasClosedRequests(): boolean {
    return this.serviceRequests.filter(data => !this.isOpenRequest(data)).length !== 0;
  }

  isOpenRequest(data: ServiceRequestData): boolean {
    return data.statusCode !== 'COMPLETED' && data.statusCode !== 'CLOSED';
  }

  addServiceRequest(): void {
    const modal = this.modalService.open(ServiceRequestEditComponent);
    modal.componentInstance.data = this.serviceRequests;
    modal.componentInstance.skipSteps(this.target.identifiableType === "vehicle", this.target);
    modal.componentInstance.onAdd(item => {
      this.serviceRequests.push(item);
    });
  }
}
