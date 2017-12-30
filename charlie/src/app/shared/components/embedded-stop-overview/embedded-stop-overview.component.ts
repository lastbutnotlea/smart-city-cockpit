import {Component, Input, OnInit} from '@angular/core';
import {LineData} from '../../data/line-data';
import { LinePositionData } from '../../data/line-position-data';


@Component({
  selector: 'app-embedded-line',
  templateUrl: './embedded-stop-overview.component.html',
  styleUrls: ['./embedded-stop-overview.component.css',
              '../../styling/embedded-components.css',
              '../../styling/global-styling.css']
})

export class EmbeddedStopOverview implements OnInit {

  @Input() linePositionData: LinePositionData;

  public ngOnInit(): void {
  }

}
