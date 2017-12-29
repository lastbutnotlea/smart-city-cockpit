import {Injectable} from '@angular/core';
import { FilterComponent } from '../shared/components/filter/filter.component';

@Injectable()
export class FilterCreatorService {

  /**
   * Adds filters for all available vehicle types to filter
   *
   * @param {FilterComponent} filter
   */
  public addVehicleFilters(filter: FilterComponent): void {
    // This works when filtering elements that have one vehicle
    // For different structures (e.g. element.trip.vehicle) a new function is needed!
    filter.addFilter('Bus', element => element.vehicle.type === 'Bus');
    filter.addFilter('Subway', element => element.vehicle.type === 'Subway');
  }

  /**
   * Adds filters for all available lines to filter
   *
   * @param {FilterComponent} filter
   */
  public addLineFilters(filter: FilterComponent): void {
    // This works when filtering elements that have one line
    // For different structures (e.g. element.vehicle.line) a new function is needed!
    filter.addFilter('7', element => element.line.name === '7');
    filter.addFilter('10', element => element.line.name === '10');
    filter.addFilter('46', element => element.line.name === '46');
    filter.addFilter('228', element => element.line.name === '228');
    filter.addFilter('283', element => element.line.name === '283');
    filter.addFilter('Bakerloo', element => element.line.name === 'Bakerloo');
    filter.addFilter('Hammersmith & City', element => element.line.name === 'Hammersmith & City');
    filter.addFilter('Jubilee', element => element.line.name === 'Jubilee');
    filter.addFilter('Victoria', element => element.line.name === 'Victoria');
    filter.addFilter('Waterloo & City', element => element.line.name === 'Waterloo & City');
  }
}
