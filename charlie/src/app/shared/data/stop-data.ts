import { ServiceRequestTarget } from './service-request-target';
import {SkipData} from "./skip-data";

export class StopData extends ServiceRequestTarget {
  commonName: string;
  peopleWaiting: number;
  lat: number;
  lon: number;
  skipData: SkipData[];
  identifiableType: String = "stop"; // Caro: brauche ich für die Service Requests zum Deserialisieren im Backend :)
}
