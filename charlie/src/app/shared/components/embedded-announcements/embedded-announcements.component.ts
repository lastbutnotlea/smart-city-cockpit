import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnnouncementData} from '../../data/announcement-data';
import {StopData} from "../../data/stop-data";
import {AnnouncementEditComponent} from "../../../view/announcement-views/edit/announcement-edit.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-embedded-announcements',
  templateUrl: './embedded-announcements.component.html',
  styleUrls: []
})

export class EmbeddedAnnouncementsComponent {
  @Input() announcements: AnnouncementData[] = [];
  @Input() stops: StopData[] = [];
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal) {}

  add(): void {
    // notify listeners that add-window has been opened
    this.notify.emit(true);
    let data = new AnnouncementData();
    data.stops = this.stops;
    const modal = this.modalService.open(AnnouncementEditComponent);
    modal.componentInstance.setModel(data);
    // notify listeners once add-window has been closed
    modal.componentInstance.closeEvent.subscribe(() => {
      this.notify.emit(false);
    });
  }
}
