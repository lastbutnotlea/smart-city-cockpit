import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/line-data';
import {VehicleData} from '../../shared/vehicle-data';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})
export class TripEditComponent implements OnInit {
  @Input() data: TripData;

  availLines: LineData[] = [];
  availVehicles: VehicleData[] = [];

  constructor(public activeModal: NgbActiveModal, private http: HttpRoutingService) { }

  ngOnInit(): void {
    this.http.getLines().subscribe(data => this.availLines = data, err => console.log('Err'));
  }
}
