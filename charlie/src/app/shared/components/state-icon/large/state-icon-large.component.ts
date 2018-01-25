import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-state-icon-large',
  templateUrl: './state-icon-large.component.html',
  styleUrls: []
})

export class StateIconLargeComponent{

  @Input() state: string = "";
}
