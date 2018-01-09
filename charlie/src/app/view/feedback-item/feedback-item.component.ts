import {Component, Input, OnInit} from '@angular/core';
import {FeedbackData} from '../../shared/data/feedback-data';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.css',
    '../../shared/styling/embedded-components.css',
    '../../shared/styling/global-styling.css'],
})
export class FeedbackItemComponent implements OnInit {

  @Input()
  item: FeedbackData;

  constructor() {
  }

  ngOnInit() {
    console.log(this.item);
  }

}
