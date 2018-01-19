import {Component, Input, OnInit} from '@angular/core';
import {LineData} from '../../data/line-data';


@Component({
  selector: 'app-embedded-line',
  templateUrl: './embedded-line.component.html',
  styleUrls: ['./embedded-line.component.css']
})

export class EmbeddedLineComponent implements OnInit {

  @Input() line: LineData;

  public ngOnInit(): void {
  }

}
