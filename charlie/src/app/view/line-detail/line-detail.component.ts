import { Component, OnInit, ViewChild } from '@angular/core';
import { LineData } from '../../shared/data/line-data';
import { HttpRoutingService } from '../../services/http-routing.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LineMapComponent } from '../line-map/line-map.component';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { LinePositionData } from '../../shared/data/line-position-data';
import { StopPositionData } from '../../shared/data/stop-position-data';
import { VehiclePositionData } from '../../shared/data/vehicle-position-data';

@Component({
  selector: 'app-line-detail-view',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})

export class LineDetailComponent extends LiveDataComponent implements OnInit {

  loaded: boolean = false;
  line: LineData;
  inboundPositionData: LinePositionData = new LinePositionData();
  outboundPositionData: LinePositionData = new LinePositionData();

/*  @ViewChild('inbound')
  lineMapInbound: LineMapComponent;
  @ViewChild('outbound')
  lineMapOutbound: LineMapComponent;*/

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.getLine();
    super.subscribeToData()
  }

  getLine(): void {
    const lineId = this.route.snapshot.paramMap.get('id');
    this.http.getLineDetails(lineId).subscribe(
      line => {
        this.line = line;
        /*this.lineMapInbound.getLineMap(line, line.stopsInbound);
        this.lineMapOutbound.getLineMap(line, line.stopsOutbound);*/
        this.getPositionData();
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
      },
          err => {
        console.log('Could not fetch line data!')
      });
  }

  goBack(): void {
    this.location.back();
  }

  getPositionData(): void {
    this.http.getVehiclePositionInboundData(this.line.id).subscribe(
      data => {
        this.inboundPositionData = data;
      }, err => {
        console.log('Could not get inbound vehicle position data.');
      }
    );
    this.http.getVehiclePositionOutboundData(this.line.id).subscribe(
      data => {
        this.outboundPositionData = data;
      }, err => {
        console.log('Could not get outbound vehicle position data.');
      }
    )
  }

  // Update line-data
  refreshData(): void {
    this.getLine();
  }
}
