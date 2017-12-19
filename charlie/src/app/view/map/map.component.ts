import {Component, Injectable, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';

import * as d3 from 'd3-selection';
import * as d3Tube from 'd3-tube-map';
import { MapCreatorService } from '../../services/map-creator.service';

@Component({
  selector: 'app-network-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
@Injectable()
export class MapComponent implements OnInit {

  constructor(private http: HttpRoutingService,
              private mapCreator: MapCreatorService) { }

  ngOnInit(): void {

  }

  public getMap(stationMapData: any, lineMapData: any, connectionMapData: any) {
    this.drawTubeMap(this.mapCreator.createMap(stationMapData, lineMapData, connectionMapData));
    this.addLineEvents();
  }

  private drawTubeMap(jsonData: any) {
    // Get element where map should be placed
    const el = document.getElementById('tube-map');

    // Add svg to element
    const canvas = d3.select(el)
      .append('svg')
      .style('width', '100%')
      .style('height', '100%');

    const width = 500;
    const height = 500;

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
    canvas.datum(jsonData).call(map);
  }

  private addLineEvents(): void {
    // get all lines from the svg
    const mapLines = d3.selectAll('.lines').selectAll('path');
    // add click-event to lines
    mapLines.on('click', line => {
      // TODO this should lead to a line-details-view
      alert('Clicked on ' + line.name);
    }).on('mouseover', line => {
      // line does not contain some attributes of the svg (like stroke-width)
      // lineSvg is the corresponding svg-element that contains these attributes as well
      // TODO: look for a solution where we don't need to select this lineSvg
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') * 1.4);
    }).on('mouseout', line => {
      const lineSvg =  d3.select('path#' + line.name);
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') / 1.4);
    });
  }
}
