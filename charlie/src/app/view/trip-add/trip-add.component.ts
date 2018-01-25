import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TripData} from '../../shared/data/trip-data';
import {HttpRoutingService} from '../../services/http-routing.service';
import {LineData} from '../../shared/data/line-data';
import {VehicleData} from '../../shared/data/vehicle-data';
import {StopData} from '../../shared/data/stop-data';
import {TripStopData} from '../../shared/data/trip-stop-data';
import {
  DropdownComponent,
  DropdownValue,
  toDropdownItems
} from '../../shared/components/dropdown/dropdown.component';
import {StopSortService} from '../../services/stop-sort.service';
import {DateParserService} from '../../services/date-parser.service';
import {dummyDate, now} from '../../shared/data/dates';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css']
})

export class TripAddComponent implements OnInit {
  availableLines: LineData[] = [];
  selectedLine = new DropdownValue(null, "select line");
  selectedDirection = new DropdownValue(null, "select direction");
  showStops = false;

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService,
              private stopSortService: StopSortService,
              private dateParser: DateParserService) {
  }

  ngOnInit(): void {
    this.http.getLines().subscribe(
      data => this.availableLines = data,
      err => console.log("Err: " + JSON.stringify(err)));
  }

  getLineDropdownItems(): DropdownValue[] {
    return toDropdownItems(this.availableLines, line => line.name);
  }

  getDirectionDropdownItems(): DropdownValue[] {
    if (this.selectedLine.value !== null) {
      return [
        new DropdownValue(true, this.getDirectionString(this.selectedLine.value.stopsInbound)),
        new DropdownValue(false, this.getDirectionString(this.selectedLine.value.stopsOutbound)),
      ];
    } else {
      return [];
    }
  }

  selectedLineChanged(): void {
    this.selectedDirection = new DropdownValue(null, "select direction");
    this.showStops = false;
  }

  getStops(): StopData[] {
    if (this.selectedLine.value === null || this.selectedDirection.value === null) {
      return [];
    } else if (this.selectedDirection.value) {
      return this.selectedLine.value.stopsInbound;
    } else {
      return this.selectedLine.value.stopsOutbound;
    }
  }

  getDirectionString(stops: StopData[]): string {
    return stops[0].commonName + ' -> ' + stops[stops.length - 1].commonName;
  }
}
