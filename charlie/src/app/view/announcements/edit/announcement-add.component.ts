import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {now} from '../../../shared/data/dates';
import {DateParserService} from '../../../services/date-parser.service';
import {StopData} from '../../../shared/data/stop-data';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {
  DropdownValue,
  toDropdownItems
} from '../../../shared/components/dropdown/dropdown.component';
import {LineData} from '../../../shared/data/line-data';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.css']
})
export class AnnouncementAddComponent implements OnInit {
  state: number = 0;

  text: string = "";

  validFrom: Date = new Date(now);
  validTo: Date = new Date(now);

  availableLines: LineData[] = [];
  availableStops: StopData[] = [];
  selectedStops: StopData[] = [];

  private data: AnnouncementData = new AnnouncementData();

  private callback: (param: AnnouncementData) => void;

  constructor(public activeModal: NgbActiveModal, public http: HttpRoutingService) {
  }

  public setModel(data: AnnouncementData): void {
    this.data = data;
    this.text = data.text;
    this.validFrom = data.validFrom;
    this.validTo = data.validTo;
    this.selectedStops = data.stops;
  }

  public onAdd(callback: (param: AnnouncementData) => void) {
    this.callback = callback;
  }

  ngOnInit() {
    this.http.getStops().subscribe(data => {
      data.sort((a, b) => a.commonName.localeCompare(b.commonName));
      this.availableStops = data;
    }, err => alert(err));
    this.http.getLines().subscribe(
      data => this.availableLines = data,
      err => alert(err));
  }

  confirm(): void {
    this.data.text = this.text;
    this.data.stops = Array.from(this.selectedStops);
    this.data.validFrom = this.validFrom;
    this.data.validTo = this.validTo;
    if (isNullOrUndefined(this.data.id)) {
      this.http.addAnnouncement(this.data).subscribe(data => {
        this.activeModal.close('Close click');
        this.data.id = data.id;
        this.callback(this.data);
      }, AnnouncementAddComponent.onErr);
    } else {
      this.http.editAnnouncement(this.data).subscribe(data => {
        this.activeModal.close('Close click');
        this.data.id = data.id;
        this.callback(this.data);
      }, AnnouncementAddComponent.onErr);
    }
  }

  onSuccess(data: AnnouncementData): void {
    this.activeModal.close('Close click');
    this.data.id = data.id;
    this.callback(this.data);
  }

  static onErr(err: any): void {
    alert('Could not add/edit announcement: ' + JSON.stringify(err));
  }

  next(): void {
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

  back(): void {
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
