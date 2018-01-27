import {Component, Input, OnInit} from '@angular/core';
import {FeedbackData} from '../../data/feedback-data';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-embedded-feedback',
  templateUrl: './embedded-feedback.component.html',
  styleUrls: ['./embedded-feedback.component.css'],
  providers: [NgbRatingConfig]
})

export class EmbeddedFeedbackComponent implements OnInit {

  @Input() feedback: FeedbackData[] = [];
  ratingnumber: number[] = [];

  constructor(private ngbRatingConfig: NgbRatingConfig) {
    ngbRatingConfig.max = 3;
    ngbRatingConfig.readonly = true;
  }

  ngOnInit() {
    this.feedback.forEach((feedback, i) => {
    if (feedback.rating === 'FINE') this.ratingnumber[i] = 3;
    else if (feedback.rating === 'PROBLEMATIC') this.ratingnumber[i] = 2;
    else this.ratingnumber[i] = 1;
    });
  }

  scrollFeedback(to: string) {

    let x = document.querySelector("#" + to);
    if (x) {
      x.scrollIntoView();
    }
  }
}
