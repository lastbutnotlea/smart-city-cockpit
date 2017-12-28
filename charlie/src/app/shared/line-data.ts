import {StopData} from './stop-data';

export class LineData {
  id: string;
  name: string;
  stopsInbound: StopData[];
  stopsOutbound: StopData[];
  // TODO: No maps! Agree on different object here (with backend)
  travelTimeInbound: any;
  travelTimeOutbound: any;
  color: any;

}
