import {Component, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EventData} from '../../shared/data/event-data';
import {HttpRoutingService} from '../../services/http-routing.service';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css',
              '../../shared/styling/global-styling.css']
})

export class EventEditComponent implements OnInit {
  @Input() @Output() data: EventData;

  selected: EventData;

  // selectedVehicle: DropdownValue;
  //
  // availLines: LineData[] = [];
  // availVehicles: VehicleData[] = [];

  constructor(public activeModal: NgbActiveModal,
              private http: HttpRoutingService) { }

  ngOnInit(): void {
    // this.http.getLines().subscribe(
    //   data => this.availLines = data,
    //   err => console.log('Err'));
    //
    // this.http.getVehicles().subscribe(
    //   data => this.availVehicles = data,
    //   err => console.log('Err'));
  }

  initData(): void {
    if (this.data != null) {
      this.selected = new EventData();
      this.selected.subject = this.data.subject;
      this.selected.priority = this.data.priority;
      this.selected.startTime = this.data.startTime;
      this.selected.endTime = this.data.endTime;
      this.selected.appointmentInvolvedParties = [];
      for(const party of this.data.appointmentInvolvedParties) {
        this.selected.appointmentInvolvedParties.push(party);
      }
      this.selected.appointmentNotes = [];
      for(const note of this.data.appointmentNotes) {
        this.selected.appointmentNotes.push(note);
      }

     //  this.selectedVehicle = this.toDropdownItem(this.selected.vehicle);
    }
  }

  confirm(): void {
    // this.data.vehicle = this.selectedVehicle.value;
    // this.data.stops = this.selected.stops;
    // this.activeModal.close('Close click');
    // this.http.editTrip(this.data).subscribe(
    //   data => {
    //     // get trips to refresh the trip detail data in trip detail view
    //     this.http.getTripDetails(this.data.id).subscribe(
    //       trip => {
    //         // copy new data into data object
    //         this.data.line = Object.assign(new LineData(), trip.line);
    //         this.data.vehicle = Object.assign(new VehicleData, trip.vehicle);
    //         this.data.stops = [];
    //         for(const stop of trip.stops) {
    //           this.data.stops.push(stop);
    //         }
    //         this.data.stops = this.stopSortService.sortStops(this.data.stops);
    //       },
    //       err => console.log('Could not fetch trip data!')
    //     );
    //   },
    //   err => console.log('Could not edit trip.')
    // );
  }
}
