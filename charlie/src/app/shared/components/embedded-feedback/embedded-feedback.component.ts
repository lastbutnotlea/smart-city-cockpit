import {Component, Input} from '@angular/core';
import { FeedbackData } from '../../data/feedback-data';

@Component({
  selector: 'app-embedded-feedback',
  templateUrl: './embedded-feedback.component.html',
  styleUrls: ['./embedded-feedback.component.css']
})

export class EmbeddedFeedbackComponent{

  @Input() feedback: FeedbackData[] = [];

  scrollFeedback(to: string){

    let x = document.querySelector("#" + to);
    if (x){
      x.scrollIntoView();
    }
  }
}
