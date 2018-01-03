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
  styleUrls: ['./line-detail.component.css',
    '../../shared/styling/global-styling.css']
})

export class LineDetailComponent extends LiveDataComponent implements OnInit {

  line: LineData;

  inboundPositionData: LinePositionData = new LinePositionData();
  outboundPositionData: LinePositionData = new LinePositionData();

  @ViewChild('inbound')
  lineMapInbound: LineMapComponent;

  @ViewChild('outbound')
  lineMapOutbound: LineMapComponent;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.getLine();
  }

  getLine(): void {
    const lineId = this.route.snapshot.paramMap.get('id');
    this.http.getLineDetails(lineId).subscribe(
      line => {
        this.line = line;
        this.lineMapInbound.getLineMap(line, line.stopsInbound);
        this.lineMapOutbound.getLineMap(line, line.stopsOutbound);
        this.getPositionData();
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
      },
          err => {
        console.log('Could not fetch line data!')
      });
  }

  goBack(): void {
    this.location.back();
  }

  isLoaded(): boolean {
    return (this.line != null
      && this.inboundPositionData.positionAtStops != null
      && this.outboundPositionData.positionAtStops != null);
  }

  getPositionData(): void {
    this.http.getVehiclePositionData(this.line.id, true).subscribe(
      data => {
        this.inboundPositionData = data;
      }, err => {
        console.log('Could not get inbound vehicle position data.');
      }
    );
    this.http.getVehiclePositionData(this.line.id, false).subscribe(
      data => {
        this.outboundPositionData = data;
      }, err => {
        console.log('Could not get outbound vehicle position data.');
      }
    )
  }

  // Update line-data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getLineDetails(this.line.id).subscribe( data => {
          this.line = data;
          this.getPositionData();
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }
}
