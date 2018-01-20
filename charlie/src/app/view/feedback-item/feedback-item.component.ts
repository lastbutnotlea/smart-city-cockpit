import {Component, Input, OnInit} from '@angular/core';
import {FeedbackData} from '../../shared/data/feedback-data';
import {DateParserService} from '../../services/date-parser.service';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.css'],
})
export class FeedbackItemComponent implements OnInit {

  @Input()
  item: FeedbackData;
  time: string;

  constructor() {
  }

  ngOnInit() {
    console.log(this.item);
    this.time = new Date(this.item.timestamp).toString();
  }

}
