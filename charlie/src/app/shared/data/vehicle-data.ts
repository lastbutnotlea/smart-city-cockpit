import { ServiceRequestTarget } from './service-request-target';

export class VehicleData extends ServiceRequestTarget {
  capacity: number;
  load: number;
  delay: number;
  temperature: number;
  defects: string[];
  type: string;
  state: string;
  identifiableType: String = "vehicle";
}
