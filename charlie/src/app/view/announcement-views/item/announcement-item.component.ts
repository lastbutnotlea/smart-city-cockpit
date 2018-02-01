import {Component, Input, OnInit} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementEditComponent} from "../edit/announcement-edit.component";
import {ConfirmDeletionComponent} from '../../../shared/components/confirm-popup/confirm-deletion.component';
import {ActivatedRoute, Params} from "@angular/router";
import {ToastService} from '../../../services/toast.service';
import {StopData} from "../../../shared/data/stop-data";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css'],
})
export class AnnouncementItemComponent implements OnInit {

  ngOnInit(): void {
    this.route.queryParams.forEach((params: Params) => {
      let id = params['id'];
      this.scrollAnnouncement(id);
    });
  }

  @Input()
  data: AnnouncementData;

  deleted: boolean = false;
  showStops: boolean = false;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private toastService: ToastService) {
  }

  editItem(): void {
    const modal = this.modalService.open(AnnouncementEditComponent);
    modal.componentInstance.setModel(this.data);
  }

  deleteItem(modal: NgbModalRef): void {
    this.http.deleteAnnouncement(this.data).subscribe(
      () => {
        this.deleted = true;
        this.toastService.showSuccessToast('Deleted ' + this.data.id);
        modal.close('Close click');
      },
      err => {
        this.toastService.showErrorToast('Failed to delete ' + this.data.id);
        modal.componentInstance.deleteDisabled = false;
        console.log(JSON.stringify(err));

      }
    );
  }

  showConfirmModal(): void {
    const modal = this.modalService.open(ConfirmDeletionComponent);
    modal.componentInstance.objectToDelete = this.data.id;
    modal.componentInstance.deletionEvent.subscribe(($event) => {
      this.deleteItem(modal);
    });
  }

  scrollAnnouncement(to: string) {
    let x = document.querySelector('#' + to);
    if (x) {
      x.scrollIntoView(true);
    }
  }

  getSortedStops(): StopData[] {
    return this.data.stops.sort((a, b) => a.commonName.localeCompare(b.commonName))
  }

}
