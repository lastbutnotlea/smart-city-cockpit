import {Component, OnInit, ViewChild} from '@angular/core';
import {FeedbackData} from '../../../shared/data/feedback-data';
import {FilterGroupComponent} from '../../../shared/components/filter-group/filter-group.component';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {FilterComponent} from '../../../shared/components/filter/filter.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  title: string = 'Feedback';
  feedback: FeedbackData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.http.getFeedback().subscribe(data => {
      this.feedback = data;
      this.loaded = true;
    }, err => {
      this.toastService.showLastingErrorToast(
        'Failed to load feedback. Please try reloading the page');
      console.log(JSON.stringify(err));
    });
    let ratingFilter: FilterComponent = new FilterComponent();
    ratingFilter.addFilter("Fine", feedback => feedback.rating === "FINE");
    ratingFilter.addFilter("Problematic", feedback => feedback.rating === "PROBLEMATIC");
    ratingFilter.addFilter("Critical", feedback => feedback.rating === "CRITICAL");
    this.filterGroup.addFilterComponent(ratingFilter);
  }
}
