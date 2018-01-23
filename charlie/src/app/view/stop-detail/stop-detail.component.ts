import {Component, OnInit} from '@angular/core';
import {StopData} from '../../shared/data/stop-data';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LiveDataComponent} from '../../shared/components/live-data/live-data.component';
import {LineForStopData} from "../../shared/data/LineForStopData";
import {FeedbackData} from '../../shared/data/feedback-data';
import {AnnouncementData} from '../../shared/data/announcement-data';
import {TripData} from '../../shared/data/trip-data';
import {TripStopData} from '../../shared/data/trip-stop-data';
import { StopData } from '../../shared/data/stop-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpRoutingService } from '../../services/http-routing.service';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import {LineForStopData} from "../../shared/data/line-for-stop-data";
import { FeedbackData } from '../../shared/data/feedback-data';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SkipStopComponent} from "../stop-skip/stop-skip";
import { AnnouncementData } from '../../shared/data/announcement-data';
import {SkipData} from "../../shared/data/skip-data";

@Component({
  selector: 'app-stop-detail-view',
  templateUrl: './stop-detail.component.html',
  styleUrls: ['./stop-detail.component.css']
})

export class StopDetailComponent extends LiveDataComponent implements OnInit {
  stop: StopData;
  trips: TripData[] = [];
  title: string = "Details";
  lineForStopDataInbound: LineForStopData [];
  lineForStopDataOutbound: LineForStopData [];
  loaded: boolean = false;
  feedback: FeedbackData[] = [];
  announcements: AnnouncementData[] = [];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.getStop();
    super.subscribeToData();

  skipStop(): void {
    const modal = this.modalService.open(SkipStopComponent);
    modal.componentInstance.data = this.stop;
  }

  getStop(): void {
    const stopId = this.route.snapshot.paramMap.get('stopId');
    this.http.getStopDetails(stopId).subscribe(
      stop => {
        this.stop = stop;
        this.getLines();
        this.getAdditionalData();
        this.getTripsForStop(stopId);
      },
      err => console.log('Could not fetch stop data!')
    );
  }

  getTripsForStop(stopId: string): void {
    this.http.getTripsForStop(stopId).subscribe(
      trips => {
        this.trips = trips;

        // search for every trip the 'right' stop, i.e. the stop that matches the stopId
        this.trips.forEach(
          trip => {
            let rightStopInTrip: TripStopData;
            trip.stops.forEach(
              stop => {
                if(stop.id === stopId) {
                  rightStopInTrip = stop;
                }
              }
            );
            // add this stop to stops so that the 'right' stop is at the end of the stops array and can be
            // read by the html code
            trip.stops.push(rightStopInTrip);
          }
        );
      },
      err => console.log('Could not fetch trip data, sorry!')
    );
  }

  getLines(): void {
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

  getAdditionalData(): void {
    this.http.getStopFeedback(this.stop.id).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        console.log(JSON.stringify(err));
      }
    );
    this.http.getStopAnnouncements(this.stop.id).subscribe(
      data => {
        this.announcements = data;
      }, err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  // update stop data
  refreshData(): void {
    this.getStop();
  }

}
