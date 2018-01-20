import { ServiceRequestTarget } from './service-request-target';

export class StopData extends ServiceRequestTarget {
  commonName: string;
  peopleWaiting: number;
  lat: number;
  lon: number;
  identifiableType: String = "stop";
}
