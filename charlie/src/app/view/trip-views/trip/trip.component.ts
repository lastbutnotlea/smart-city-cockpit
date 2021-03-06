import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {TripEditComponent} from '../trip-edit/trip-edit.component';
import {LiveDataComponent} from '../../../shared/components/live-data/live-data.component';
import {TripData} from '../../../shared/data/trip-data';
import {FilterGroupComponent} from "../../../shared/components/filter-group/filter-group.component";
import {StringFormatterService} from '../../../services/string-formatter.service';
import {HttpRoutingService} from '../../../services/http-routing.service';
import {StopSortService} from '../../../services/stop-sort.service';
import {FilterComponent} from '../../../shared/components/filter/filter.component';
import {getUrlForId} from "../../../shared/util/routing-util";
import {ToastService} from '../../../services/toast.service';


@Component({
  selector: 'app-trip-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})

export class TripComponent extends LiveDataComponent implements OnInit {
  title: String;
  trips: TripData[] = [];
  loaded: boolean = false;

  @ViewChild(FilterGroupComponent)
  filterGroup: FilterGroupComponent;

  constructor(private http: HttpRoutingService,
              private modalService: NgbModal,
              private router: Router,
              private stopSortService: StopSortService,
              public stringFormatter: StringFormatterService,
              private toastService: ToastService) {
    super();
  }

  public ngOnInit(): void {
    this.title = 'Trip View';
    this.addFilter();
    super.subscribeToData();
  }

  private getTrips(): void {
    // get trip data
    this.http.getTrips().subscribe(
      data => {
        this.trips = data;
        this.loaded = true;
        this.trips.forEach(trip => trip.stops = this.stopSortService.sortStops(trip.stops));
        // This starts periodical calls for live-data after first data was received
        },
      err => {
        this.toastService.showLastingErrorToast('Failed to load trips');
        console.log(JSON.stringify(err));
      });
  }

  addTrip(): void {
    super.unsubscribe();
    const modal = this.modalService.open(TripEditComponent);
    modal.componentInstance.initData();
    modal.componentInstance.closeEvent.subscribe(() => {
      super.subscribeToData();
    });
    modal.componentInstance.addEvent.subscribe(($event) => {
      this.trips.push($event);
    });
  }

  private addFilter(): void {
    this.http.getFilterData().subscribe(
      data => {
        // add filters for lines
        let lineFilter = new FilterComponent();
        for (let val in data.lineNames) {
          let name = data.lineNames[val];
          lineFilter.addFilter(name, trip => trip.line.name === name);
        }
        this.filterGroup.addFilterComponent(lineFilter);

        let stateFilter = new FilterComponent();
        stateFilter.addFilter('Fine', trip => trip.vehicle.state === 'FINE');
        stateFilter.addFilter('Problematic', trip => trip.vehicle.state === 'PROBLEMATIC');
        stateFilter.addFilter('Critical', trip => trip.vehicle.state === 'CRITICAL');
        this.filterGroup.addFilterComponent(stateFilter);
      },
      err => {
        this.toastService.showLastingErrorToast('Failed to load filter data');
        console.log(JSON.stringify(err));
      }
    )
  }

  // update trips
  refreshData(): void {
    this.getTrips();
  }

  goToLink(id: string): void {
    let link: string = getUrlForId(id);
    this.router.navigate([link]);
  }
}
