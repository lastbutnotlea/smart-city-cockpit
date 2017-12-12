import { Pipe, PipeTransform } from '@angular/core';
import {TripData} from '../shared/trip-data';

@Pipe({ name: 'tripsPipe' })
export class FilterTripsPipe implements PipeTransform {

  transform(allTripsToFilter: TripData[], args: boolean[]) {

    let filtered: TripData[] = allTripsToFilter;

    // apply first filter
    if (args[0]) {
      // We can't easily use functions here.
      // Unlike directly accesing type, if using trip.getLineId(), the function is not found
      // TODO: Look for nicer solutions for this
      filtered = filtered.filter(trip => trip.line.id === '1');
    }
    // apply second filter
    if (args[1]) {
      // We can't easily use functions here.
      // Unlike directly accesing type, if using trip.getVehicleType(), the function is not found
      filtered = filtered.filter(trip => trip.vehicle.type === 'Bus');
    }

    // trip data that satisfies all applied filters
    return filtered;
  }
}
