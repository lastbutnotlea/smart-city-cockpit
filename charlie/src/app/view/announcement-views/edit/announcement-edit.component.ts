import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StopData} from '../../../shared/data/stop-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {LineData} from '../../../shared/data/line-data';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {isNullOrUndefined} from "util";
import {ToastService} from '../../../services/toast.service';
import {DateUtil} from "../../../shared/util/date-util";

@Component({
  selector: 'app-announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.css']
})
export class AnnouncementEditComponent implements OnInit, OnDestroy {
  state: number = 0;
  saveDisabled: boolean = false;
  title: string = "Create new announcement";

  text: string = "";

  validFrom: Date = new Date();
  validTo: Date = new Date();

  availableLines: LineData[] = [];
  availableStops: StopData[] = [];
  selectedStops: StopData[] = [];

  // this can hold the reference to an edit model, but is still updated only on "confirm"
  private data: AnnouncementData = new AnnouncementData();
  @Output() closeEvent = new EventEmitter<boolean>();

  private callback: (param: AnnouncementData) => void = () => {
  };

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.http.getStops().subscribe(
      data => {
        data.sort((a, b) => a.commonName.localeCompare(b.commonName));
        this.availableStops = data;
      }, err => {
        this.toastService.showLastingErrorToast("Could not load stop data");
        console.log("An error occurred: " + JSON.stringify(err));
      });
    this.http.getLines().subscribe(
      data => this.availableLines = data,
      err => {
        this.toastService.showLastingErrorToast("Could not load stop data");
        console.log("An error occurred: " + JSON.stringify(err));
      });
  }

  ngOnDestroy() {
    this.closeEvent.emit(true);
  }

  public setModel(data: AnnouncementData): void {
    this.data = data;
    this.title = data.id ? "Edit " + data.id : "Create new announcement";
    this.text = data.text ? data.text : '';
    this.validFrom = data.validFrom ? new Date(data.validFrom) : new Date();
    this.validTo = data.validTo ? new Date(data.validTo) : new Date();
    this.selectedStops = data.stops ? data.stops : [];
  }

  /**
   * allows to do something on "confirm"
   * @param {(param: AnnouncementData) => void} callback whatever you want to do
   */
  public onAdd(callback: (param: AnnouncementData) => void) {
    this.callback = callback;
  }

  setStops(stops: StopData[]): void {
    this.selectedStops = stops;
  }

  confirm(): void {
    this.saveDisabled = true;
    this.data.text = this.text;
    this.data.stops = Array.from(this.selectedStops);
    this.data.validFrom = DateUtil.cutTimezoneInformation(this.validFrom);
    this.data.validTo = DateUtil.cutTimezoneInformation(this.validTo);
    if (isNullOrUndefined(this.data.id)) {
      this.http.addAnnouncement(this.data).subscribe(
        data => {
          this.activeModal.close('Close click');
          this.toastService.showSuccessToast('Added ' + data.id);
          this.data.id = data.id;
          this.callback(this.data);
        },
        err => {
          this.toastService.showErrorToast('Failed to add announcement');
          console.log("An error occurred: " + JSON.stringify(err));
          this.saveDisabled = false;
        });
    } else {
      this.http.editAnnouncement(this.data).subscribe(
        data => {
          this.activeModal.close('Close click');
          this.data.id = data.id;
          this.toastService.showSuccessToast('Edited ' + data.id);
          this.callback(this.data);
        },
        err => {
          this.toastService.showErrorToast('Failed to edit ' + this.data.id);
          console.log("An error occurred: " + JSON.stringify(err));
          this.saveDisabled = false;
        });
    }
  }

  isNextEnabled(): boolean {
    if (this.saveDisabled) return false;
    switch (this.state) {
      case 0:
        return this.text !== '';
      case 2:
        return this.selectedStops.length > 0;
      default:
        return true;
    }
  }

  next(): void {
    if (!this.isNextEnabled()) return;
    switch (this.state) {
      case 0:
      case 1:
        this.state++;
        break;
      case 2:
        this.confirm();
        break;
    }
  }

  isBackEnabled(): boolean {
    if (this.saveDisabled) return false;
    return this.state > 0;
  }

  back(): void {
    if (!this.isBackEnabled()) return;
    switch (this.state) {
      case 0:
        break;
      case 1:
      case 2:
        this.state--;
        break;
    }
  }
}
