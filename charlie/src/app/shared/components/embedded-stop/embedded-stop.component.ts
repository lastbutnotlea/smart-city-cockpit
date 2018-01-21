import {Component, Input, OnInit} from '@angular/core';
import { StopData } from '../../data/stop-data';
import {LineForStopData} from "../../data/line-for-stop-data";

@Component({
  selector: 'app-embedded-stop',
  templateUrl: './embedded-stop.component.html',
  styleUrls: ['./embedded-stop.component.css']
})

export class EmbeddedStopComponent implements OnInit {

  @Input() stop: StopData;
  @Input() lineForStopDataInbound: LineForStopData [];
  @Input() lineForStopDataOutbound: LineForStopData [];

  public ngOnInit(): void {
  }

}
