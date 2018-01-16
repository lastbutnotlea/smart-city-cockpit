import {Component, OnInit} from '@angular/core';
import { StopData } from '../../shared/data/stop-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpRoutingService } from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import {LineForStopData} from "../../shared/data/LineForStopData";

@Component({
  selector: 'app-stop-detail-view',
  templateUrl: './stop-detail.component.html',
  styleUrls: ['./stop-detail.component.css',
    '../../shared/styling/embedded-components.css',
    '../../shared/styling/global-styling.css']
})

export class StopDetailComponent extends LiveDataComponent implements OnInit {
  stop: StopData;
  title: string = "Details";
  lineForStopDataInbound: LineForStopData [];
  lineForStopDataOutbound: LineForStopData [];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
    super();
  }

  ngOnInit(): void {
    this.getStop();
  }

  getStop(): void {
    const stopId = this.route.snapshot.paramMap.get('stopId');
    // TODO: add live data once live data generator from backend works
    this.http.getStopDetails(stopId).subscribe(
      stop => {
        this.stop = stop
        this.getLines();
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
      },
      err => console.log('Could not fetch stop data!')
    );
  }

  getLines() : void{
    this.http.getLineForStop(this.stop.id).subscribe(
      data => {
        this.lineForStopDataInbound = data.filter(line => line.isInbound);
        this.lineForStopDataOutbound = data.filter(line => !line.isInbound);
        // This starts periodical calls for live-data after first data was received
      },
      err => console.log('Could not fetch stop data!')
    );
  }

  goBack(): void {
    this.location.back();
  }

  isLoaded(): boolean {
    return this.stop != null;
  }

  // update stop data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getStopDetails(this.stop.id).subscribe( data => {
          this.stop = data;
          this.getLines()
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new stop-data.')
      ));

  }

}
