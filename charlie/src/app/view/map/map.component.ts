import {Component, Injectable} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3zoom from 'd3-zoom';
import * as d3Tube from 'd3-tube-map';
import { MapCreatorService } from '../../services/map-creator.service';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-network-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
@Injectable()
export class MapComponent {

  map: any;
  width: any;
  height: any;

  constructor(private router: Router,
              private mapCreator: MapCreatorService) { }

  public getMap(stationMapData: any, lineMapData: any, connectionMapData: any) {
    console.log(stationMapData);
    console.log(lineMapData);
    console.log(connectionMapData);
    this.drawTubeMap(this.mapCreator.createMap(stationMapData, lineMapData, connectionMapData));
    this.addLineEvents();
    this.setZoom();
  }

  private drawTubeMap(jsonData: any) {
    console.log(jsonData);

    // Get element where map should be placed
    const el = document.getElementById('tube-map');

    this.width = window.innerWidth/2;
    this.height = window.innerHeight * 3/5;

    // Add svg to element
    const canvas = d3.select(el)
      .append('svg')
      .style('width', this.width + 'px')
      .style('height', this.height + 'px');

    // create new tube map
    this.map = d3Tube.tubeMap()
      .width(this.width)
      .height(this.height)
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
    //increas stroke-width of lines
    mapLines.each(line => {
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') * 1.5);
    });
    // add click-event to lines
    mapLines.on('click', line => {
      this.router.navigate(['/network/detail/' + line.name]);
    }).on('mouseover', line => {
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') * 1.5);
    }).on('mouseout', line => {
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') / 1.5);
    });
  }

  setZoom() {
    var svg = d3.select('#tube-map').select('svg');
    var zoom = d3zoom
      .zoom()
      .scaleExtent([0.5, 6])
      .on('zoom', zoomed);
    var zoomContainer = svg.call(zoom);
    //using environment variables here because we need different zoom on heroku
    zoom.scaleTo(zoomContainer, environment.initialZoom);
    zoom.translateTo(zoomContainer,
      environment.initalTraslate[0] / environment.initialZoom,
      environment.initalTraslate[1] / environment.initialZoom);
    function zoomed() {
      svg.select('g').attr('transform', d3.event.transform.toString());
    }
  }
}
