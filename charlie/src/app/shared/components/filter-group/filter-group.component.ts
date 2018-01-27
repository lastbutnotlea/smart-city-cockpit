import {Component} from '@angular/core';
import {FilterComponent} from '../filter/filter.component';
import {VehicleData} from "../../data/vehicle-data";
import {TripData} from "../../data/trip-data";
import {ServiceRequestData} from "../../data/service-request-data";
import {FeedbackData} from "../../data/feedback-data";
import {EventData} from "../../data/event-data";

@Component({
  selector: 'app-filter-group-view',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.css',],
})
export class FilterGroupComponent {

  filters: FilterComponent[] = [];
  text: string = "";

  public addFilterComponent(filter: FilterComponent): void {
    this.filters.push(filter);
  }

  getFiltered(list: any[]): any[] {
    for (const filter of this.filters) {
      list = filter.getFiltered(list);
    }
    return list;
  }

  searchVehicle(list: VehicleData[]): VehicleData[] {
    return list.filter(v =>
      v.id.toLowerCase().includes(this.text.toLowerCase())
      || v.load.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.capacity.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.delay.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.temperature.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.defects.toString().toLowerCase().includes(this.text.toLowerCase())
      || v.type.toLowerCase().includes(this.text.toLowerCase())
      || v.state.toLowerCase().includes(this.text.toLowerCase())
      || v.freeFrom.toLowerCase().includes(this.text.toLowerCase())
      || ((v.currentLine === null)
      ? false
      : (v.currentLine.name.toLowerCase().includes(this.text.toLowerCase())
        || v.currentLine.id.toLowerCase().includes(this.text.toLowerCase()))));
  }

  searchTrip(list: TripData[]): TripData[] {
    return list.filter(v =>
      v.id.toLowerCase().includes(this.text.toLowerCase())
      || ((v.vehicle === null) ? false : v.vehicle.id.toLowerCase().includes(this.text.toLowerCase()))
      || ((v.line === null)
      ? false
      : (v.line.name.toLowerCase().includes(this.text.toLowerCase())
        || v.line.id.toLowerCase().includes(this.text.toLowerCase())))
      || ((v.stops === null)
      ? false
      : v.stops.some(s => s.id.toLowerCase().includes(this.text.toLowerCase())
        || s.name.toLowerCase().includes(this.text.toLowerCase()))));
  }

  searchServiceRequest(list: ServiceRequestData[]): ServiceRequestData[] {
    return list.filter(v =>
      v.id.toLowerCase().includes(this.text.toLowerCase())
      || v.name.toLowerCase().includes(this.text.toLowerCase())
      || v.serviceType.toLowerCase().includes(this.text.toLowerCase())
      || v.statusCode.toLowerCase().includes(this.text.toLowerCase())
      || v.dueDate.toLowerCase().includes(this.text.toLowerCase())
      || v.completionDate.toLowerCase().includes(this.text.toLowerCase())
      || v.serviceRequestDescription.some(c => c.text.toLowerCase().includes(this.text.toLowerCase()))
      || v.priority.toLowerCase().includes(this.text.toLowerCase()));
  }

  searchFeedback(list: FeedbackData[]): FeedbackData[] {
    return list.filter(v =>
      v.id.toLowerCase().includes(this.text.toLowerCase())
      || v.feedbackType.toLowerCase().includes(this.text.toLowerCase())
      || v.message.toLowerCase().includes(this.text.toLowerCase())
      || v.rating.toLowerCase().includes(this.text.toLowerCase())
      || v.timestamp.toLowerCase().includes(this.text.toLowerCase())
      || v.objective.id.toLowerCase().includes(this.text.toLowerCase()));
  }

  searchEvent(list: EventData[]): EventData[] {
    return list.filter(v =>
      v.id.toLowerCase().includes(this.text.toLowerCase())
      || v.subject.toLowerCase().includes(this.text.toLowerCase())
      || v.priority.toLowerCase().includes(this.text.toLowerCase())
      || v.startTime.toLowerCase().includes(this.text.toLowerCase())
      || v.endTime.toLowerCase().includes(this.text.toLowerCase())
      || v.appointmentInvolvedParties.some(c => c.partyName.toLowerCase().includes(this.text.toLowerCase()))
      || v.appointmentNotes.some(c => c.text.toLowerCase().includes(this.text.toLowerCase())));

  }
}
