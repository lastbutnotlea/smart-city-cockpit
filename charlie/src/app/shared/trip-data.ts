
import { VehicleData } from './vehicle-data';
import { LineData } from './line-data';
import { TripStopData } from './trip-stop-data';

export class TripData {
  id: string;
  isInbound: boolean;
  vehicle: VehicleData;
  line: LineData;
  stops: TripStopData[];
}
