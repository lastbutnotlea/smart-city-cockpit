import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ServiceRequestAddComponent} from '../service-request-add/service-request-add.component';
import {StringFormatterService} from '../../../services/string-formatter.service';
import {ServiceRequestData} from '../../../shared/data/service-request-data';
import {FilterGroupComponent} from '../../../shared/components/filter-group/filter-group.component';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {FilterComponent} from '../../../shared/components/filter/filter.component';
import {Router} from "@angular/router";

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
              private stringFormatter: StringFormatterService) {
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
      err => console.log('Could not fetch trips.')
    );
  }

  private addFilter(): void {
    this.http.getFilterData().subscribe(
      data => {
        // TODO: change this if needed data can be requested from backend
        let stateFilter = new FilterComponent();
        stateFilter.addFilter('Low', serviceRequest => serviceRequest.priority === 'FINE');
        stateFilter.addFilter('Medium', serviceRequest => serviceRequest.priority === 'PROBLEMATIC');
        stateFilter.addFilter('High', serviceRequest => serviceRequest.priority === 'CRITICAL');
        this.filterGroup.addFilterComponent(stateFilter);

        let serviceTypeFilter = new FilterComponent();
        serviceTypeFilter.addFilter('Cleaning', serviceRequest => serviceRequest.serviceType === 'CLEANING');
        serviceTypeFilter.addFilter('Maintenance', serviceRequest => serviceRequest.serviceType === 'MAINTENANCE');
        this.filterGroup.addFilterComponent(serviceTypeFilter);
      },
      err => {
        console.log('Could not fetch filter data!');
      }
    )
  }

  addServiceRequest(): void {
    const modal = this.modalService.open(ServiceRequestAddComponent);
    modal.componentInstance.data = this.serviceRequests;
    modal.componentInstance.onAdd(item => {
      this.serviceRequests.push(item);
    });
  }

  goToLink(id: string): void {
    this.router.navigate(["serviceRequests/detail/" + id]);
  }
}
