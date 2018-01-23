import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/data/line-data';
import { MapComponent } from '../map/map.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})

export class NetworkComponent extends LiveDataComponent implements OnInit {
  title: String;
  lines: LineData[] = [];
  state: string = "";
  loaded: boolean = false;

  @ViewChild(MapComponent)
  networkMap: MapComponent;

  constructor(private http: HttpRoutingService) {
    super();
  }

  ngOnInit(): void {
    this.title = 'Network';
    // get line data
    this.getNetworkData();
    this.getMapData();
    super.subscribeToData();
  }

  getNetworkData(): void {
    this.http.getLines().subscribe( data => {
        this.lines = data;
        this.loaded = true;
      },
      err => {
        console.log('Could not fetch lines.');
      }
    );
    this.http.getNetworkState().subscribe(
      data => {
        this.state = data;
      },
      err => {
        console.log(err);
        alert('Could not get state of network from backend.');
      }
    );
  }

  private getMapData(): void {
    // TODO: If this is causing any performance issues, change back to parallel calls, in each subscribe, check if data from other two calls is already available
    this.http.getMapDataStations().subscribe(stationsData => {
      this.http.getMapDataLines().subscribe(linesData => {
        this.http.getMapDataConnections().subscribe(connectionsData => {
            this.networkMap.getMap(stationsData, linesData, connectionsData);
          },
          err => {
            console.log('Could not fetch Map-Data for connections');
          });
        }, err => {
          console.log('Could not fetch Map-Data for lines');
        });
      }, err => {
      console.log('Could not fetch Map-Data for stations.');
    });
  }

  // update network data
  refreshData(): void {
    this.getNetworkData();
  }

}
