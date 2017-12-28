import {Component, Input, OnInit} from '@angular/core';
import {LineData} from '../../line-data';


@Component({
  selector: 'app-embedded-line',
  templateUrl: './embedded-line.component.html',
  styleUrls: ['./embedded-line.component.css', '../../styling/embedded-components.css']
})

export class EmbeddedLineComponent implements OnInit {

  @Input() line: LineData;

  public ngOnInit(): void {
  }

}
