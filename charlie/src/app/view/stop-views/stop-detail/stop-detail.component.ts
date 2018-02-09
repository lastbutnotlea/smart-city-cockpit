import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {StopData} from '../../../shared/data/stop-data';
import {TripData} from '../../../shared/data/trip-data';
import {LineForStopData} from '../../../shared/data/line-for-stop-data';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SkipStopComponent} from '../stop-skip/stop-skip';
import {TripStopData} from '../../../shared/data/trip-stop-data';
import {SkipData} from "../../../shared/data/skip-data";
import {ToastService} from "../../../services/toast.service";
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';

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
  serviceRequests: ServiceRequestData[] = [];

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private location: Location,
              private modalService: NgbModal,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    super.subscribeToData();
  }

  skipStop(): void {
    const modal = this.modalService.open(SkipStopComponent);
    modal.componentInstance.data = this.stop;
    modal.componentInstance.onAdd(item => {
      this.stop = item;
    });
  }

  unSkipStop(modal: NgbModalRef, skipData: SkipData): void {
    this.http.unSkipStop(this.stop.id, skipData).subscribe(
      () => {
        this.stop.skipData = this.stop.skipData.filter(ss => ss.id !== skipData.id);
        this.toastService.showSuccessToast("Stop " + this.stop.id + " was sucessfully unskipped.")
        modal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to unskip ' + this.stop.id);
        modal.componentInstance.deleteDisabled = false;
        console.log(JSON.stringify(err));
      }
    );
  }

  showConfirmModal(skipData: SkipData): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = skipData.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.unSkipStop(modal, skipData);
    });
  }

  getStop(): void {
    const stopId = this.route.snapshot.paramMap.get('stopId');
    this.getData(stopId);
    this.getTripsForStop(stopId);
  }

  getData(stopId: string): void {
    this.http.getStopDetails(stopId).subscribe(
      stop => {
        this.stop = stop;
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load details of stop ' + stopId);
        console.log(JSON.stringify(err));
      });
    this.getLines(stopId);
    this.getAdditionalData(stopId);
    this.getTripsForStop(stopId);
  }

  getTripsForStop(stopId: string): void {
    this.http.getTripsForStop(stopId).subscribe(
      trips => {
        this.trips = trips;

        // search for every trip the 'right' stop, i.e. the stop that matches the stopId
        this.trips.forEach(
          trip => {
            let rightStopInTrip: TripStopData = null;
            trip.stops.forEach(
              stop => {
                if (stop.id === stopId) {
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
      err => {
        this.toastService.showLastingErrorToast('Failed to load trips for stop ' + stopId);
        console.log(JSON.stringify(err));
      });
  }

  getLines(stopId: string): void {
    this.http.getLineForStop(stopId).subscribe(
      data => {
        this.lineForStopDataInbound = data.filter(line => line.isInbound);
        this.lineForStopDataOutbound = data.filter(line => !line.isInbound);
        this.loaded = true;
        // This starts periodical calls for live-data after first data was received
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load lines for stop ' + stopId);
        console.log(JSON.stringify(err));
      });
  }

  getAdditionalData(stopId: string): void {
    this.http.getStopFeedback(stopId).subscribe(
      data => {
        this.feedback = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load feedback for stop ' + stopId);
        console.log(JSON.stringify(err));
      }
    );
    this.http.getStopAnnouncements(stopId).subscribe(
      data => {
        this.announcements = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load announcements for stop ' + stopId);
        console.log(JSON.stringify(err));
      }
    );
    this.http.getStopServiceRequests(stopId).subscribe(
      data => {
        this.serviceRequests = data;
      }, err => {
        this.toastService.showLastingErrorToast('Failed to load serviceRequests for stop ' + stopId);
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
