import {Component, Injectable} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Tube from 'd3-tube-map';
import { MapCreatorService } from '../../services/map-creator.service';
import { Router } from '@angular/router';
import { LineData } from '../../shared/line-data';

@Component({
  selector: 'app-line-map',
  templateUrl: './line-map.component.html',
  styleUrls: ['../../shared/styling/map.css']
})
@Injectable()
export class LineMapComponent {

  constructor(private router: Router,
              private mapCreator: MapCreatorService) { }

  public getLineMap(lineData: LineData) {
    this.drawLineMap(this.mapCreator.createSingleLineMap(lineData));
  }

  private drawLineMap(lineJson: any) {
    // Get element where map should be placed
    const el = document.getElementById('line-map');

    const width = 1200;
    const height = 250;

    // Add svg to element
    const canvas = d3.select(el)
      .append('svg')
      .style('width', width + 'px')
      .style('height', height + 'px');

    // create new tube map
    const map = d3Tube.tubeMap()
      .width(width)
      .height(height)
      .margin({
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    // draw objects according to jsonData into map
    canvas.datum(lineJson).call(map);
    debugger;
  }
}
