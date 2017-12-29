import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-filter-group-view',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.css'],
})
export class FilterGroupComponent {

  filters: FilterComponent[] = [];

  public addFilterComponent(id: string): void {
    let filter = new FilterComponent();
    filter.id = id;
    this.filters.push(filter);
  }

  public getFilter(id: string): FilterComponent {
    for(let filter of this.filters) {
      if(filter.id === id){
        return filter;
      }
    }
    return null;
  }

  getFiltered(list: any[]): any[] {
    for (const filter of this.filters) {
      list = filter.getFiltered(list);
    }
    return list;
  }

}
