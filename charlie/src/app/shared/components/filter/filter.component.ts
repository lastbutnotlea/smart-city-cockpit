import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input()
  filters: [string, boolean, (any) => boolean][] = [];

  addFilter(text: string, predicate: (any) => boolean) {
    this.filters.push([text, true, predicate]);
  }

  getFiltered(list: any[]): any[] {
    let result = [];
    for (const filter of this.filters) {
      if (filter[1]) {
        result.push.apply(result, list.filter(filter[2]));
      }
    }
    return result;
  }

  changeAll(select: boolean){
    for (const filter of this.filters) {
      filter[1] = select;
    }
  }
}
