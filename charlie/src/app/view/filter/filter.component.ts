import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  filters: [string, boolean, (any) => boolean][] = [];

  addFilter(text: string, predicate: (any) => boolean) {
    this.filters.push([text, false, predicate]);
  }

  getFiltered(list: any[]): any[] {
    for (const filter of this.filters) {
      if (filter[1]) {
        list = list.filter(filter[2]);
      }
    }
    return list;
  }

}
