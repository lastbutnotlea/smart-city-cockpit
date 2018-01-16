import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AnnouncementAddComponent} from '../announcement-add/announcement-add.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement-main.component.html',
  styleUrls: [
    './announcement-main.component.css',
    '../../../shared/styling/embedded-components.css',
  ]
})
export class AnnouncementMainComponent implements OnInit {

  data: AnnouncementData[] = [];
  title: string = 'Announcements';

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.http.getAnnouncements().subscribe(data => this.data = data, err => alert('Could not fetch data'));
  }

  add(): void {
    const modal = this.modalService.open(AnnouncementAddComponent);
    modal.componentInstance.onAdd(item => this.data.push(item));
  }
}
