import {Component, Input, OnInit} from '@angular/core';
import {LineData} from '../../data/line-data';
import { LinePositionData } from '../../data/line-position-data';


@Component({
  selector: 'app-embedded-stop-overview',
  templateUrl: './embedded-stop-overview.component.html',
  styleUrls: ['./embedded-stop-overview.component.css']
})

export class EmbeddedStopOverviewComponent implements OnInit {

  @Input() color: string;
  @Input() linePositionData: LinePositionData;
  @Input() title: string;

  public ngOnInit(): void {
  }

}
