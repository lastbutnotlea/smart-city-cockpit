import {Component, Input, OnInit} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementAddComponent} from "../edit/announcement-add.component";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css'],
})
export class AnnouncementItemComponent implements OnInit {
  @Input()
  data: AnnouncementData;

  deleted: boolean = false;

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  editItem(): void {
    const modal = this.modalService.open(AnnouncementAddComponent);
    modal.componentInstance.setModel(this.data);
  }

  deleteItem(): void {
    console.log("test");
    this.http.deleteAnnouncement(this.data).subscribe(
      data => this.deleted = true,
      err => alert(JSON.stringify(err))
    );
  }

}
