import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-state-icon-medium',
  templateUrl: './state-icon-medium.component.html'
})

export class StateIconMediumComponent{

  @Input() state: string = "";
}
