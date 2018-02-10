import {Component, Input, OnInit} from '@angular/core';
import {FeedbackData} from "../../../shared/data/feedback-data";
import {HttpRoutingService} from "../../../services/http-routing.service";
import {ActivatedRoute, Params} from "@angular/router";
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.css'],
  providers: [NgbRatingConfig]
})
export class FeedbackItemComponent implements OnInit {

  @Input()
  item: FeedbackData;
  time: string;
  ratingnumber: number = 0;

  constructor(private http: HttpRoutingService,
              private route: ActivatedRoute,
              private ngbRatingConfig: NgbRatingConfig,
              private toastService: ToastService) {
    ngbRatingConfig.max = 3;
    ngbRatingConfig.readonly = true;
  }

  ngOnInit() {
    this.time = new Date(this.item.timestamp).toString();
    this.route.queryParams.forEach((params: Params) => {
      let id = params['id'];
      this.scrollFeedback(id);
    });

    if (this.item.rating === 'FINE') this.ratingnumber = 3;
    else if (this.item.rating === 'PROBLEMATIC') this.ratingnumber = 2;
    else this.ratingnumber = 1;
  }

  processFeedback() {
    if (this.item.processed) {
      this.item.processed = false;
      this.http.unprocessFeedback(this.item.id).subscribe(
        data => {
          console.log('Unprocessed Feedback ' + data);
        },
        err => {
          this.toastService.showLastingErrorToast('Failed to unprocess feedback');
          console.log(JSON.stringify(err));
        });
    } else {
      this.item.processed = true;
      this.http.processFeedback(this.item.id).subscribe(
        data => {
          console.log('Processed Feedback ' + data);
        },
        err => {
          this.toastService.showLastingErrorToast('Failed to process feedback');
          console.log(JSON.stringify(err));
        });
    }
  }

  scrollFeedback(to: string) {
    let x = document.querySelector('#' + to);
    if (x) {
      x.scrollIntoView(true);
    }
  }

}
