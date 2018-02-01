import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {AnnouncementData} from '../../../shared/data/announcement-data';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AnnouncementEditComponent} from '../edit/announcement-edit.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement-main.component.html',
  styleUrls: ['./announcement-main.component.css']
})
export class AnnouncementMainComponent implements OnInit {

  data: AnnouncementData[] = [];
  title: string = 'Announcements';
  loaded: boolean = false;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.http.getAnnouncements().subscribe(
      data => {
        this.data = data;
        this.loaded = true;
      },
    err => {
      this.toastService.showLastingErrorToast(
        'Failed to load announcements. Please try reloading the page');
      console.log(JSON.stringify(err));
      });
  }

  add(): void {
    const modal = this.modalService.open(AnnouncementEditComponent);
    modal.componentInstance.onAdd(item => this.data.push(item));
  }
}
