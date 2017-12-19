import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';
import {MapComponent} from '../map/map.component';

// Test data
// TODO replace with data from backend
const stationMapData = {
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
const lineMapData = {
  'Town' : {
    'name': 'Town',
    'color': '#0014ff'
  },
  'Circle' : {
    'name': 'Circle',
    'color': '#ffd300',
  }
};
const connectionMapData = {
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

  constructor(private http: HttpRoutingService,
              private networkMap: MapComponent) { }

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
    this.networkMap.getMap(stationMapData, lineMapData, connectionMapData);
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
}
