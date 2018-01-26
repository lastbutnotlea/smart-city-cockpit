import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {LinePositionData} from '../../../shared/data/line-position-data';
import {LineData} from '../../../shared/data/line-data';
import {HttpRoutingService} from '../../../services/http-routing.service';

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
        this.loaded = true;
      },
          err => {
        console.log('Could not fetch line data!')
      });
    this.getPositionData(lineId);
  }

  goBack(): void {
    this.location.back();
  }

  getPositionData(id: string): void {
    this.http.getVehiclePositionInboundData(id).subscribe(
      data => {
        this.inboundPositionData = data;
      }, err => {
        console.log('Could not get inbound vehicle position data.');
      }
    );
    this.http.getVehiclePositionOutboundData(id).subscribe(
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
