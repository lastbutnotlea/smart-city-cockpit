import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-state-icon',
  templateUrl: './state-icon.component.html',
  styleUrls: []
})

export class StateIconComponent{

  @Input() state: string = "";
  @Input() size: string = "";
}
