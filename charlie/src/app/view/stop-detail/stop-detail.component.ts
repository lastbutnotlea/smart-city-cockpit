import {Component, OnInit} from '@angular/core';
import { StopData } from '../../shared/data/stop-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpRoutingService } from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import {LineForStopData} from "../../shared/data/LineForStopData";
import { FeedbackData } from '../../shared/data/feedback-data';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SkipStopComponent} from "../stop-skip/stop-skip";

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
  loaded: boolean = false;
  feedback: FeedbackData[];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.getStop();
  }

  skipStop(): void {
    const modal = this.modalService.open(SkipStopComponent);
    modal.componentInstance.data = stop;
  }

  getStop(): void {
    const stopId = this.route.snapshot.paramMap.get('stopId');
    // TODO: add live data once live data generator from backend works
    this.http.getStopDetails(stopId).subscribe(
      stop => {
        this.stop = stop;
        this.getLines();
        this.getFeedback();
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
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
      },
      err => console.log('Could not fetch stop data!')
    );
  }

  getFeedback(): void {
    this.http.getStopFeedback(this.stop.id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        alert("Could not fetch feedback for vehicle! " +
          "Please check your internet connection or inform your system administrator.");
        console.log(err);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  // update stop data
  refreshData(): void {
    this.setDataSubscription(
      this.http.getStopDetails(this.stop.id).subscribe( data => {
          this.stop = data;
          this.getLines();
          this.getFeedback();
          this.subscribeToData();
        },
        err =>
          console.log('Could not fetch new stop-data.')
      ));

  }

}
