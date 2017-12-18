
import { VehicleData } from './vehicle-data';
import { LineData } from './line-data';

export class TripData {

  id: string;
  isInbound: boolean;
  vehicle: VehicleData;
  line: LineData;
  //         stopID, time of departure
  stops: Map<String, Date>;
}
