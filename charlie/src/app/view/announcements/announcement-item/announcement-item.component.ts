import {Component, Input, OnInit} from '@angular/core';
import {AnnouncementData} from "../../../shared/data/announcement-data";

@Component({
  selector: 'app-announcement-item',
  templateUrl: './announcement-item.component.html',
  styleUrls: ['./announcement-item.component.css',
    '../../../shared/styling/embedded-components.css',
    '../../../shared/styling/global-styling.css'],
})
export class AnnouncementItemComponent implements OnInit {
  @Input()
  data: AnnouncementData;

  constructor() { }

  ngOnInit() {
  }

}
