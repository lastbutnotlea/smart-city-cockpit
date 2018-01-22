import {Component, Input} from '@angular/core';
import { ServiceRequestData } from '../../data/service-request-data';

@Component({
  selector: 'app-embedded-service-requests',
  templateUrl: 'embedded-service-request.component.html',
  styleUrls: []
})

export class EmbeddedServiceRequestComponent{

  @Input() serviceRequests: ServiceRequestData[] = [];

  hasOpenRequests(): boolean {
    return this.serviceRequests.filter(data => this.isOpenRequest(data)).length !== 0;
  }

  hasClosedRequests(): boolean {
    return this.serviceRequests.filter(data => !this.isOpenRequest(data)).length !== 0;
  }

  isOpenRequest(data: ServiceRequestData): boolean {
    return data.statusCode !== 'COMPLETED' && data.statusCode !== 'CLOSED';
  }
}
