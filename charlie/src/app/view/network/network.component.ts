import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Tube from 'd3-tube-map';

import { Station, Stations } from './stations';
import { Line, Lines } from './lines';
import { Connection, Connections } from './connections';

const jsonFile = require('./stations.json');

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {
  title: String;
  lines: LineData[] = [];

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  private stations: Station[] = [];
  private tubes: Line[] = [];
  private connections: Connection[] = [];

  constructor(private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.title = 'network view';
    // get line data
    /*this.http.getLines().subscribe( data => {
        this.lines = data;
      },
      err => {
        console.log('Could not fetch lines.');
      }
    );*/

    this.stations = Stations;
    this.connections = Connections;
    this.tubes = Lines;

    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();

    this.tube();
  }


  /**
   * Returns true if lines contains at least one line, false otherwise
   * @returns {boolean}
   */
  isLoaded(): boolean {
    if (this.lines.length > 0) {
      return true;
    }
    return false;
  }

  private tube() {
    debugger;
    const el = document.getElementById('tube-map');

    const canvas = d3.select(el)
      .append('svg')
      .style('width', '100%')
      .style('height', '100%');

    const width = 1200;
    const height = 1200;

    const map = d3Tube.tubeMap()
      .width(width)
      .height(height)
      .margin({
        top: height / 50,
        right: width / 7,
        bottom: height / 10,
        left: width / 7,
      });

    /*d3.json('stations.json', function(error, data) {
      canvas.datum(data).call(map);
    });*/

    canvas.datum(jsonFile).call(map);
  }

  private initSvg() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    const minLat = d3Array.min(this.stations, function(d) {return d.latitude; });
    const minLon = d3Array.min(this.stations, function(d) {return d.longitude; });
    const maxLat = d3Array.max(this.stations, function(d) {return d.latitude; });
    const maxLon = d3Array.max(this.stations, function(d) {return d.longitude; });

    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain([minLon, maxLon]);
    this.y.domain([minLat, maxLat]);
  }

  private drawAxis() {

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');
  }

  private drawLine() {

    this.svg.append('svg:line')
      .attr('class', 'line')
      .attr('stroke', '#AE6017')
      .attr('x1', 1)
      .attr('y1',  1)
      .attr('x2', 100)
      .attr('y2', 100);

    this.connections.forEach(connection => {
      const s1 = this.getStationById(connection.station1);
      const s2 = this.getStationById(connection.station2);
      this.svg.append('svg:line')
        .attr('class', 'line')
        .attr('stroke', '#AE6017')
        .attr('x1', this.x(s1.longitude))
        .attr('y1', this.y(s1.latitude))
        .attr('x2', this.x(s2.longitude))
        .attr('y2', this.y(s2.latitude));
    });
  }

  private getStationById(id: number): Station {
    let result = null;
    this.stations.forEach(station => {
      if (station.id === id) {
        result = station;
      }
    });
    return result;
  }
}
