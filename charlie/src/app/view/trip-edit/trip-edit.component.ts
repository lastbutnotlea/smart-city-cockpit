import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/line-data';
import {VehicleData} from '../../shared/vehicle-data';
import {StopData} from "../../shared/stop-data";

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})
export class TripEditComponent implements OnInit {
  @Input() data: TripData;
  selected: TripData;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];
  availStops: StopData[] = [];

  constructor(public activeModal: NgbActiveModal, private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => this.availLines = data,
        err => console.log('Err'));
  }

  confirm(): void {
    this.data.line = this.selected.line;
    this.data.vehicle = this.selected.vehicle;
    console.log('Confirm trip editing: selected line: ' + this.data.line.id +
      ' selected vehicle: ' + this.data.vehicle.id);
    this.activeModal.close('Close click');
  }

  initData(): void {
    if (this.data != null) {
      this.selected = new TripData;
      this.selected.line = this.data.line;
      this.selected.vehicle = this.data.vehicle;
    }
  }

  computeStops(): void {
    // this.http.getStops(this.selected.line.id);
  }
}
