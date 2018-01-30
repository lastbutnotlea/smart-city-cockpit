import {Component, Injectable} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3zoom from 'd3-zoom';
import * as d3Tube from 'd3-tube-map';
import {Router} from '@angular/router';
import {MapCreatorService} from '../../../services/map-creator.service';
import {environment} from '../../../../environments/environment';

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
    this.drawTubeMap(this.mapCreator.createMap(stationMapData, lineMapData, connectionMapData));
    this.addLineEvents();
    this.setZoom();
    this.noChangeOfCursorOnInterchanges();
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
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
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

  private noChangeOfCursorOnInterchanges(): void {
    d3.selectAll('.interchanges').selectAll('path').style("cursor", "context-menu");
  }

  setZoom() {
    var svg = d3.select('#tube-map').select('svg');
    var zoom = d3zoom
      .zoom()
      .scaleExtent(environment.zoomScale)
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
