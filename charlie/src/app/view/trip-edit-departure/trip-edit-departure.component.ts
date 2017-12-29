import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import { TripStopData } from '../../shared/data/trip-stop-data';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-trip-edit-departure',
  templateUrl: './trip-edit-departure.component.html',
  styleUrls: ['./trip-edit-departure.component.css',  '../../shared/styling/global-styling.css']
})

export class TripEditDepartureComponent implements OnInit {
  @Input() data: TripData;

  selectedStop: DropdownValue;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService) { }

  ngOnInit(): void {
  }

  confirm(): void {
   // this.data.vehicle = this.selectedVehicle.value;
    this.activeModal.close('Close click');
    this.http.editTrip(this.data);
  }

  initData(): void {
    if (this.data.stops != null) {
      this.selectedStop = this.toDropdownItem(this.data.stops[0]);
    }
  }

  toDropdownItem(item: TripStopData): DropdownValue {
    return new DropdownValue(item, item.name);
  }

  toDropdownItems(items: TripStopData[]): DropdownValue[] {
    return items.map(item => this.toDropdownItem(item));
  }
}
