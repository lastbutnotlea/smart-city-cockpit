import {Component, Injectable} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3zoom from 'd3-zoom';
import * as d3Tube from 'd3-tube-map';
import { MapCreatorService } from '../../services/map-creator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css', '../../shared/styling/map.css']
})
@Injectable()
export class MapComponent {

  map: any;

  constructor(private router: Router,
              private mapCreator: MapCreatorService) { }

  public getMap(stationMapData: any, lineMapData: any, connectionMapData: any) {
    console.log(stationMapData);
    console.log(lineMapData);
    console.log(connectionMapData);
    this.drawTubeMap(this.mapCreator.createMap(stationMapData, lineMapData, connectionMapData));
    this.addLineEvents();
  }

  private drawTubeMap(jsonData: any) {
    console.log(jsonData);

    // Get element where map should be placed
    const el = document.getElementById('tube-map');

    const width = 800;
    const height = 450;

    // Add svg to element
    const canvas = d3.select(el)
      .append('svg')
      .style('width', width + 'px')
      .style('height', height + 'px');

    // create new tube map
    this.map = d3Tube.tubeMap()
      .width(width)
      .height(height)
      .margin({
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    // draw objects according to jsonData into map
    canvas.datum(jsonData).call(this.map);
  }

  private addLineEvents(): void {
    // get all lines from the svg
    const mapLines = d3.selectAll('.lines').selectAll('path');
    // add click-event to lines
    mapLines.on('click', line => {
      this.router.navigate(['/network/detail/' + line.name]);
    }).on('mouseover', line => {
      // line does not contain some attributes of the svg (like stroke-width)
      // lineSvg is the corresponding svg-element that contains these attributes as well
      // TODO: look for a solution where we don't need to select this lineSvg

      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') * 1.6);
    }).on('mouseout', line => {
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') / 1.6);
    });

    debugger;
    const el = document.getElementById('tube-map');
    const test1 = d3.select(el).select('svg');
    const test2 = d3.select('rect');
    const test3 = this.map.width;
    const test4 = this.map.width('100%');

    var svg = d3.select('#tube-map').select('svg');

    var zoom = d3zoom
      .zoom()
      .scaleExtent([0.5, 6])
      .on('zoom', zoomed);

    var zoomContainer = svg.call(zoom);
    var initialScale = 2.5;
    var initialTranslate = [100, 200];

    zoom.scaleTo(zoomContainer, initialScale);
    zoom.translateTo(zoomContainer, initialTranslate[0], initialTranslate[1]);

    function zoomed() {
      svg.select('g').attr('transform', d3.event.transform.toString());
    }
    debugger;
  }
}
