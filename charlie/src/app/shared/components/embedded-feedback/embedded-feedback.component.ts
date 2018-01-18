import {Component, Input, OnInit} from '@angular/core';
import {VehicleData} from '../../data/vehicle-data';
import { FeedbackData } from '../../data/feedback-data';

@Component({
  selector: 'app-embedded-feedback',
  templateUrl: './embedded-feedback.component.html',
  styleUrls: ['./embedded-feedback.component.css',
              '../../styling/embedded-components.css',
              '../../styling/global-styling.css']
})

export class EmbeddedFeedbackComponent implements OnInit {

  @Input() feedback: FeedbackData[] = [];

  public ngOnInit(): void {
  }

}
