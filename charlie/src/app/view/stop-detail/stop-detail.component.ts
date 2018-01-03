import {Component, OnInit} from '@angular/core';
import { StopData } from '../../shared/data/stop-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpRoutingService } from '../../services/http-routing.service';
import { GeneralizedComponent } from '../../shared/components/generalized/live-data.component';

@Component({
  selector: 'app-stop-detail-view',
  templateUrl: './stop-detail.component.html',
  styleUrls: ['./stop-detail.component.css',
    '../../shared/styling/embedded-components.css',
    '../../shared/styling/global-styling.css']
})

export class StopDetailComponent extends GeneralizedComponent implements OnInit {
  stop: StopData;
  title: string = "Stop Details";

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
        this.stop = stop;
        // This starts periodical calls for live-data after first data was received
        super.ngOnInit();
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
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new line-data.')
      ));
  }

}
