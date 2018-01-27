import {Component} from '@angular/core';
import {FilterComponent} from '../filter/filter.component';
import {VehicleData} from "../../data/vehicle-data";

@Component({
  selector: 'app-filter-group-view',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.css',],
})
export class FilterGroupComponent {

  filters: FilterComponent[] = [];
  text: string = "";

  public addFilterComponent(filter: FilterComponent): void {
    this.filters.push(filter);
  }

  getFiltered(list: any[]): any[] {
    for (const filter of this.filters) {
      list = filter.getFiltered(list);
    }
    return list;
  }

  searchVehicle(list: VehicleData[]): VehicleData[] {
    return list.filter(v =>
         v.id.toLowerCase().includes(this.text.toLowerCase())
      || v.load.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.capacity.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.delay.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.temperature.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.defects.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.type.toLowerCase().includes(this.text.toLowerCase())
      || v.state.toLowerCase().includes(this.text.toLowerCase())
      || v.freeFrom.toLowerCase().includes(this.text.toLowerCase())
      || ((v.currentLine === null)?false:v.currentLine.name.toLowerCase().includes(this.text.toLowerCase())));
  }
}
