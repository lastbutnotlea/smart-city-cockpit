import {Component, OnInit, ViewChild} from '@angular/core';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {LineData} from '../../../shared/data/line-data';
import {MapComponent} from '../map/map.component';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {ToastService} from '../../../services/toast.service';

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
  mapLoaded: boolean = false;

  @ViewChild(MapComponent)
  networkMap: MapComponent;

  constructor(private http: HttpRoutingService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.title = 'Network';
    super.subscribeToData();
  }

  getNetworkData(): void {
    this.http.getLines().subscribe( data => {
        this.lines = data;
        this.loaded = true;
        if(!this.mapLoaded){
          this.getMapData();
        }
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load lines');
        console.log(JSON.stringify(err));
      }
    );
    this.http.getNetworkState().subscribe(
      data => {
        this.state = data;
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load state of network');
        console.log(JSON.stringify(err));
      }
    );
  }

  private getMapData(): void {
    this.mapLoaded = true;
    // TODO: If this is causing any performance issues, change back to parallel calls, in each subscribe, check if data from other two calls is already available
    this.http.getMapDataStations().subscribe(stationsData => {
      this.http.getMapDataLines().subscribe(linesData => {
        this.http.getMapDataConnections().subscribe(connectionsData => {
            this.networkMap.getMap(stationsData, linesData, connectionsData);
          },
          err => {
            this.toastService.showLastingErrorToast('Failed to load connections of map data. Please reload the page');
            console.log(JSON.stringify(err));
          });
        }, err => {
          this.toastService.showLastingErrorToast('Failed to load lines of map data. Please reload the page');
          console.log(JSON.stringify(err));
        });
      }, err => {
      this.toastService.showLastingErrorToast('Failed to load stations of map data. Please reload the page');
      console.log(JSON.stringify(err));
    });
  }

  // update network data
  refreshData(): void {
    this.getNetworkData();
  }

}
