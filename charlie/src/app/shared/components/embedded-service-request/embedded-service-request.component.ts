import {Component, Input} from '@angular/core';
import { ServiceRequestData } from '../../data/service-request-data';

@Component({
  selector: 'app-embedded-service-requests',
  templateUrl: 'embedded-service-request.component.html',
  styleUrls: []
})

export class EmbeddedServiceRequestComponent{

  @Input() serviceRequests: ServiceRequestData[] = [];

}
