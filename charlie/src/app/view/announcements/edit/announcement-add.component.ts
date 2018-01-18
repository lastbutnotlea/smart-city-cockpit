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

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.css']
})
export class AnnouncementAddComponent implements OnInit {
  text: string = "";

  validFrom: Date = new Date(now);
  validTo: Date = new Date(now);

  availableLines: LineData[] = [];
  availableStops: StopData[] = [];
  selectedStops: StopData[] = [];

  private callback: (param: AnnouncementData) => void;

  constructor(public activeModal: NgbActiveModal, public http: HttpRoutingService) {
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
    let announcement: AnnouncementData = new AnnouncementData();
    announcement.text = this.text;
    announcement.stops = Array.from(this.selectedStops);
    announcement.validFrom = this.validFrom;
    announcement.validTo = this.validTo;
    this.http.addAnnouncement(announcement).subscribe(
      data => {
        this.activeModal.close('Close click');
        announcement.id = data.id;
        this.callback(announcement);
      },
      err => alert('Could not edit trip.' + err)
    );
  }

  public onAdd(callback: (param: AnnouncementData) => void) {
    this.callback = callback;
  }
}
