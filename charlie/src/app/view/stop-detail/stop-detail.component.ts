import {Component, OnInit} from '@angular/core';
import { StopData } from '../../shared/data/stop-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpRoutingService } from '../../services/http-routing.service';

@Component({
  selector: 'app-stop-detail-view',
  templateUrl: './stop-detail.component.html',
  styleUrls: ['./stop-detail.component.css', '../../shared/styling/embedded-components.css']
})

export class StopDetailComponent implements OnInit {

  stop: StopData;
  title: string = "Stop Details";

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location) {
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

}
