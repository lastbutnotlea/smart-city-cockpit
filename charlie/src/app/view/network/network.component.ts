import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';

import * as d3 from 'd3-selection';
import * as d3Tube from 'd3-tube-map';

const jsonFile = require('./mapData.json');

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NetworkComponent implements OnInit {
  title: String;
  lines: LineData[] = [];

  private margin = {top: 20, right: 20, bottom: 20, left: 20};
  private svg: any;

  constructor(private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.title = 'network view';
    // get line data
    this.http.getLines().subscribe( data => {
        this.lines = data;
      },
      err => {
        console.log('Could not fetch lines.');
      }
    );

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
    const el = document.getElementById('tube-map');

    const canvas = d3.select(el)
      .append('svg')
      .style('width', '100%')
      .style('height', '100%');

    const width = 2000;
    const height = 500;

    const map = d3Tube.tubeMap()
      .width(width)
      .height(height)
      .margin({
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    canvas.datum(jsonFile).call(map);
  }
}
