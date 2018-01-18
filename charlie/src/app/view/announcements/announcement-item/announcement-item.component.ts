import {Component, Input, OnInit} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css',
    '../../../shared/styling/embedded-components.css'
  ],
})
export class AnnouncementItemComponent implements OnInit {
  @Input()
  data: AnnouncementData;

  deleted: boolean = false;

  constructor(private http: HttpRoutingService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  editItem(): void {

  }

  deleteItem(): void {
    console.log("test");
    this.http.deleteAnnouncement(this.data).subscribe(
      data => this.deleted = true,
      err => alert(JSON.stringify(err))
    );
  }

}
