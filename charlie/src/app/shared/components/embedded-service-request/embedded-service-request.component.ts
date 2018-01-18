import {Component, Input} from '@angular/core';
import { ServiceRequestData } from '../../data/service-request-data';

@Component({
  selector: 'app-embedded-service-requests',
  templateUrl: './embedded-service-requests.component.html',
  styleUrls: ['../../styling/embedded-components.css',
    '../../styling/global-styling.css']
})

export class EmbeddedServiceRequestComponent{

  @Input() serviceRequests: ServiceRequestData[];

}
