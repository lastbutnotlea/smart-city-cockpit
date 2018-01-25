import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-state-icon-small',
  templateUrl: './state-icon-small.component.html',
  styleUrls: []
})

export class StateIconSmallComponent{

  @Input() state: string = "";
}
