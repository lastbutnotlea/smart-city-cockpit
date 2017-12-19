
import { VehicleData } from './vehicle-data';
import { LineData } from './line-data';
import { StopData } from './stop-data';

export class TripData {
  id: string;
  vehicle: VehicleData;
  line: LineData;
  stops: StopData[] = [];
}
