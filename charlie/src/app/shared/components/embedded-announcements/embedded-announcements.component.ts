import {Component, Input} from '@angular/core';
import { AnnouncementData } from '../../data/announcement-data';

@Component({
  selector: 'app-embedded-announcements',
  templateUrl: './embedded-announcements.component.html',
  styleUrls: []
})

export class EmbeddedAnnouncementsComponent{

  @Input() announcements: AnnouncementData[] = [];

}
