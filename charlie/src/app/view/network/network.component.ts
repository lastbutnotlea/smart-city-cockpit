import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';

import * as d3 from 'd3-selection';
import * as d3Tube from 'd3-tube-map';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { MapCreatorService } from '../../services/map-creator.service';

// Test data
// TODO replace with data from backend
const testStations = {
  'Mill' : {
    'title': 'Mill',
    'position' : {
      'lat': 52.201552,
      'lon': 0.116128
    }
  },
  'Regal' : {
    'title': 'Regal',
    'position' : {
      'lat': 52.202947,
      'lon': 0.123806
    }
  },
  'ClarendonArms' : {
    'title': 'Clarendon Arms',
    'position' : {
      'lat': 52.20465,
      'lon': 0.127679
    }
  },
  'StRadegund' : {
    'title': 'St. Radegund',
    'position': {
      'lat': 52.207616,
      'lon': 0.126733
    }
  }
};
const testLines = {
  'Town' : {
    'name': 'Town',
    'color': '#0014ff'
  },
  'Circle' : {
    'name': 'Circle',
    'color': '#ffd300',
  }
};
const testConnections = {
  'Town' : [
    {
      'station' : 'Mill',
      'number': 1
    },
    {
      'station' : 'Regal',
      'number': 2
    },
    {
      'station' : 'ClarendonArms',
      'number': 3
    },
    {
      'station' : 'StRadegund',
      'number': 4
    }
  ],
  'Circle' : [
    {
      'station' : 'Mill',
      'number': 1
    },
    {
      'station' : 'Regal',
      'number': 2
    }
  ]
};

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NetworkComponent implements OnInit {
  title: String;
  lines: LineData[] = [];

  constructor(private http: HttpRoutingService, private mapCreator: MapCreatorService) { }

  ngOnInit(): void {
    this.title = 'Network View';
    // get line data
    this.http.getLines().subscribe( data => {
        this.lines = data;
      },
      err => {
        console.log('Could not fetch lines.');
      }
    );
    this.drawTubeMap(this.mapCreator.createMap(testStations, testLines, testConnections));
    this.addLineEvents();
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
      const lineSvg =  d3.select('path#' + line.name)
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') * 1.2);
    }).on('mouseout', line => {
      const lineSvg =  d3.select('path#' + line.name)
      lineSvg.attr('stroke-width', lineSvg.attr('stroke-width') / 1.2);
    });
  }
}
