import { Pipe, PipeTransform } from '@angular/core';
import {TripDetails} from "../trip/trip-details";

@Pipe({ name: 'tripsPipe' })
export class FilterTripsPipe implements PipeTransform {
  transform(allTripsToFilter: TripDetails[], args:boolean[]) {
    var filtered = allTripsToFilter;
    if(args[0] && !args[1]){
      filtered = filtered.filter(trip => trip.isFiltered1());
    }
    if(args[1] && !args[0]) {
      filtered = filtered.filter(trip => trip.isFiltered2());
    }
    /*if(args[0] && args[1]){
      var firstFilter = allTripsToFilter.filter(trip => trip.isFiltered1());
      return firstFilter.filter(trip => trip.isFiltered2());
    }*/
    return filtered;
  }
}
