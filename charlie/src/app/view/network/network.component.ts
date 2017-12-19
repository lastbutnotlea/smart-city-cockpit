import { Component, OnInit } from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import { LineData } from '../../shared/line-data';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-network-view',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
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
    this.getMapData();
  }

  private getMapData(): void {
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

  /**
   * Returns true if lines contains at least one line, false otherwise
   * @returns {boolean}
   */
  public isLoaded(): boolean {
    if (this.lines.length > 0) {
      return true;
    }
    return false;
  }
}
