import { ServiceRequestTarget } from './service-request-target';
import {LineData} from './line-data';

export class VehicleData extends ServiceRequestTarget {
  capacity: number;
  load: number = 0;
  delay: number = 0;
  temperature: number = null;
  defects: string[] = [];
  type: string;
  state: string;
  identifiableType: String = "vehicle";
  freeFrom: string;
  isShutDown: boolean = false;
  currentLine: LineData = null;
}
