import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-filter-group-view',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.css',],
})
export class FilterGroupComponent {

  filters: FilterComponent[] = [];

  public addFilterComponent(filter: FilterComponent): void {
    this.filters.push(filter);
  }

  getFiltered(list: any[]): any[] {
    for (const filter of this.filters) {
      list = filter.getFiltered(list);
    }
    return list;
  }

}
