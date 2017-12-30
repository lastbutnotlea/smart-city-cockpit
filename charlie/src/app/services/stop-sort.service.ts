import {Injectable} from '@angular/core';
import {TripStopData} from '../shared/data/trip-stop-data';

@Injectable()
export class StopSortService {

  public sortStops(array: TripStopData[]): TripStopData[] {
    array.sort((a: any, b: any) => {
      if (a.departureTime < b.departureTime) {
        return -1;
      } else if (a.departureTime > b.departureTime) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
