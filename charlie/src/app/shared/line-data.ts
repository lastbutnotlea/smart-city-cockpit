
import {StopData} from './stop-data';

export class LineData {
  id: string;
  name: string;
  stopsInbound: StopData[];
  stopsOutbound: StopData[];
  travelTimeInbound: Map<string, number>;
  travelTimeOutbound: Map<string, number>;
  color: string;

}
