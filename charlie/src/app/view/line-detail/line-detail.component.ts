import { Component, OnInit, ViewChild } from '@angular/core';
import { LineData } from '../../shared/data/line-data';
import { HttpRoutingService } from '../../services/http-routing.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LineMapComponent } from '../line-map/line-map.component';
import { GeneralizedComponent } from '../../shared/components/generalized/generalized.component';

@Component({
  selector: 'app-line-detail-view',
  templateUrl: './line-detail.component.html',
  styleUrls: ['./line-detail.component.css']
})

export class LineDetailComponent extends GeneralizedComponent implements OnInit {

  line: LineData;

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
    // TODO: route to stop-details view
    // TODO: add live-data (status, vehicle positions)
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
    return (this.line != null);
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
