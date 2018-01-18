import {Component, Input, OnInit} from '@angular/core';
import {FeedbackData} from '../../shared/data/feedback-data';
import {DateParserService} from '../../services/date-parser.service';
import {HttpRoutingService} from "../../services/http-routing.service";

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
  time: string;

  constructor(private http: HttpRoutingService) {
  }

  ngOnInit() {
    console.log(this.item);
    this.time = new Date(this.item.timestamp).toString();
  }

  processFeedback() {
    this.item.processed = true;
    this.http.processFeedback(this.item).subscribe(
      data => {
      },
      err => console.log('Could not process feedback.')
    );
  }

}
