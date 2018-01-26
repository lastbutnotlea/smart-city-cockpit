import {Component, Input, OnInit} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementEditComponent} from "../edit/announcement-edit.component";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css'],
})
export class AnnouncementItemComponent implements OnInit{

  ngOnInit(): void {
    this.route.queryParams.forEach((params: Params) => {
      let id = params['id'];
      this.scrollAnnouncement(id);
    });
  }

  @Input()
  data: AnnouncementData;

  deleted: boolean = false;

  constructor(private http: HttpRoutingService, private modalService: NgbModal,
              private route: ActivatedRoute) {
  }

  editItem(): void {
    const modal = this.modalService.open(AnnouncementEditComponent);
    modal.componentInstance.setModel(this.data);
  }

  deleteItem(): void {
    this.http.deleteAnnouncement(this.data).subscribe(
      data => this.deleted = true,
      err => {
        alert("An Error occurred. Could not delete Announcement Item.");
        console.log(JSON.stringify(err));
      }
    );
  }

  scrollAnnouncement(to: string){
    let x = document.querySelector('#' + to);
    if (x){
      x.scrollIntoView(true);
    }
  }

}
