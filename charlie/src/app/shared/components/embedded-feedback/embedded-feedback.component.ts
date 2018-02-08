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
  }

  scrollFeedback(to: string) {
    let x = document.querySelector("#" + to);
    if (x) {
      x.scrollIntoView();
    }
  }

  getRatingNumber(feedbackNr: number) : number{

    if (this.feedback[feedbackNr].rating === 'FINE') {
      return 3;
    }
    else if (this.feedback[feedbackNr].rating === 'PROBLEMATIC') {
      return 2;
    }
    else {
      return 1;
    }
  }
}
