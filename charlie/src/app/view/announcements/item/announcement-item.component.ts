import {Component, Input} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementEditComponent} from "../edit/announcement-edit.component";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css'],
})
export class AnnouncementItemComponent {
  @Input()
  data: AnnouncementData;

  deleted: boolean = false;

  constructor(private http: HttpRoutingService, private modalService: NgbModal) {
  }

  editItem(): void {
    const modal = this.modalService.open(AnnouncementEditComponent);
    modal.componentInstance.setModel(this.data);
  }

  deleteItem(): void {
    this.http.deleteAnnouncement(this.data).subscribe(
      data => this.deleted = true,
      err => {
        alert("An Error occurred.");
        console.log(JSON.stringify(err));
      }
    );
  }

}
