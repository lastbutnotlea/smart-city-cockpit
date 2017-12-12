
import { VehicleData } from './vehicle-data';
import { LineData } from './line-data';
import { StopData } from './stop-data';

export class TripDetails {

  id: number;
  vehicle: VehicleData;
  line: LineData;
  stops: StopData[] = [];

  constructor(public firstParam: string, public secondParam: string) { }

  public isFiltered1(): boolean {
    if(this.firstParam === 'filtered'){
      return true;
    }
    return false;
  }

  public isFiltered2(): boolean {
    if(this.secondParam === 'filtered'){
      return true;
    }
    return false;
  }
}
