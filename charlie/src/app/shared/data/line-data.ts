import {StopData} from './stop-data';

export class LineData {
  id: string;
  name: string;
  stopsInbound: StopData[];
  stopsOutbound: StopData[];
  type: string;
  color: any;
  state: string;
}
