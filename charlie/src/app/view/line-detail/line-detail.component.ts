import { Component, OnInit, ViewChild } from '@angular/core';
import { LineData } from '../../shared/data/line-data';
import { HttpRoutingService } from '../../services/http-routing.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LineMapComponent } from '../line-map/line-map.component';
import { GeneralizedComponent } from '../../shared/components/generalized/live-data.component';
import { LinePositionData } from '../../shared/data/line-position-data';
import { StopPositionData } from '../../shared/data/stop-position-data';
import { VehiclePositionData } from '../../shared/data/vehicle-position-data';

@Component({
  selector: 'app-line-detail-view',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css',
    '../../shared/styling/global-styling.css']
})

export class LineDetailComponent extends GeneralizedComponent implements OnInit {

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

    // Dummy-Data for positions of vehicles
    // TODO: Replace with data from backend, once available
    this.inboundPositionData.positionAfterStop
      .push(new StopPositionData('id1', 'name1', 'FINE',
        [new VehiclePositionData('v1', 'BUS', 'CRITICAL'),
          new VehiclePositionData('v4', 'SUBWAY', 'PROBLEMATIC')]));
    this.inboundPositionData.positionAtStop
      .push(new StopPositionData('id1', 'name1', 'CRITICAL', []));
  }

  getLine(): void {
    const lineId = this.route.snapshot.paramMap.get('id');
    this.http.getLineDetails(lineId).subscribe(
      line => {
        this.line = line;
        this.lineMapInbound.getLineMap(line, line.stopsInbound);
        this.lineMapOutbound.getLineMap(line, line.stopsOutbound);
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
    return (this.line != null && this.inboundPositionData != null && this.outboundPositionData != null);
  }

  // Update line-data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getLineDetails(this.line.id).subscribe( data => {
          this.line = data;
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }
}
