import { ServiceRequestTarget } from './service-request-target';
import {LineData} from './line-data';

export class VehicleData extends ServiceRequestTarget {
  capacity: number;
  load: number;
  delay: number;
  temperature: number;
  defects: string[];
  type: string;
  state: string;
  identifiableType: String = "vehicle";
  isShutDown: boolean;
  currentLine: LineData;
}
