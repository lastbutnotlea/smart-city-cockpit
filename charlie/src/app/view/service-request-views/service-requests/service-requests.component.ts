import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestEditComponent} from '../service-request-edit/service-request-edit.component';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {FilterGroupComponent} from '../../../shared/components/filter-group/filter-group.component';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {FilterComponent} from '../../../shared/components/filter/filter.component';
import {Router} from "@angular/router";
import {dummyDate} from '../../../shared/data/dates';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-service-requests-view',
  templateUrl: './service-requests.component.html',
  styleUrls: ['./service-requests.component.css']
})

export class ServiceRequestsComponent implements OnInit {
  title: String;
  serviceRequests: ServiceRequestData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              private router: Router,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
  }

  public ngOnInit(): void {
    this.title = 'Service Requests';
    this.addFilter();
    this.getServiceRequests();
  }

  private getServiceRequests(): void {
    // get trip data
    this.http.getServiceRequests().subscribe(
      data => {
        this.serviceRequests = data;
        for(let s of this.serviceRequests){
          s.feedbacks = [];
        }
        this.loaded = true;
        },
      err => {
        this.toastService.showLastingErrorToast(
          'Failed to load service requests. Please try reloading the page');
        console.log(JSON.stringify(err))
      });
  }

  private addFilter(): void {
    let stateFilter = new FilterComponent();
    stateFilter.addFilter('Low', serviceRequest => serviceRequest.priority === 'FINE');
    stateFilter.addFilter('Medium', serviceRequest => serviceRequest.priority === 'PROBLEMATIC');
    stateFilter.addFilter('High', serviceRequest => serviceRequest.priority === 'CRITICAL');
    this.filterGroup.addFilterComponent(stateFilter);

    let serviceTypeFilter = new FilterComponent();
    serviceTypeFilter.addFilter('Cleaning', serviceRequest => serviceRequest.serviceType === 'CLEANING');
    serviceTypeFilter.addFilter('Maintenance', serviceRequest => serviceRequest.serviceType === 'MAINTENANCE');
    this.filterGroup.addFilterComponent(serviceTypeFilter);
  }

  addServiceRequest(): void {
    const modal = this.modalService.open(ServiceRequestEditComponent);
    modal.componentInstance.data = this.serviceRequests;
    modal.componentInstance.onAdd(item => {
      this.serviceRequests.push(item);
    });
  }

  goToLink(id: string): void {
    this.router.navigate(["serviceRequests/detail/" + id]);
  }

  hasCompletionDate(serviceRequest: ServiceRequestData): boolean {
    return serviceRequest.completionDate !== dummyDate;
  }
}
