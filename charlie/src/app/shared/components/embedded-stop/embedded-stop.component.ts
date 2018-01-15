import {Component, Input, OnInit} from '@angular/core';
import { StopData } from '../../data/stop-data';

@Component({
  selector: 'app-embedded-stop',
  templateUrl: './embedded-stop.component.html',
  styleUrls: ['./embedded-stop.component.css',
              '../../styling/embedded-components.css',
              '../../styling/global-styling.css']
})

export class EmbeddedStopComponent implements OnInit {

  @Input() stop: StopData;

  public ngOnInit(): void {
  }

}
