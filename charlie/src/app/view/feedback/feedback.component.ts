import {Component, OnInit} from '@angular/core';
import {HttpRoutingService} from '../../services/http-routing.service';
import {FeedbackData} from '../../shared/data/feedback-data';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  title: string = 'Feedback';
  feedback: FeedbackData[] = null;

  constructor(private http: HttpRoutingService) {
  }

  ngOnInit() {
    this.http.getFeedback().subscribe(data => this.feedback = data);
  }

}
