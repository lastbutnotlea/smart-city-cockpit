import { Pipe, PipeTransform } from '@angular/core';
import {TripDetails} from '../shared/trip-data';

@Pipe({ name: 'tripsPipe' })
export class FilterTripsPipe implements PipeTransform {
  transform(allTripsToFilter: TripDetails[], args: boolean[]) {
    let filtered = allTripsToFilter;
    if (args[0]){
      filtered = filtered.filter(trip => trip.isFiltered1());
    }
    if (args[1]) {
      filtered = filtered.filter(trip => trip.isFiltered2());
    }
    return filtered;
  }
}
