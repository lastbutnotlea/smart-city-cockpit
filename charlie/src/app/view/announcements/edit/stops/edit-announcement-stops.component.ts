import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  DropdownValue,
  toDropdownItems
} from "../../../../shared/components/dropdown/dropdown.component";
import {StopData} from "../../../../shared/data/stop-data";
import {LineData} from "../../../../shared/data/line-data";

@Component({
  selector: 'app-edit-announcement-stops',
  templateUrl: './edit-announcement-stops.component.html',
  styleUrls: ['./edit-announcement-stops.component.css']
})
export class EditAnnouncementStopsComponent {
  availableStops: DropdownValue[];
  selectedStop: DropdownValue = new DropdownValue(null, 'Select a stop');

  availableLines: DropdownValue[];
  selectedLine: DropdownValue = new DropdownValue(null, 'Select a line');

  selectedStopSet: Set<StopData> = new Set();

  toStopId: (StopData) => string = (s: StopData) => s.commonName + ' (' + s.id + ')';

  @Input()
  set stops(stops: StopData[]) {
    this.availableStops = toDropdownItems(stops, this.toStopId);
  }

  @Input()
  set lines(lines: LineData[]) {
    this.availableLines = toDropdownItems(lines, l => l.name);
  }

  @Output()
  selectedStops: EventEmitter<Set<StopData>> = new EventEmitter<Set<StopData>>();

  constructor() {
  }

  addSelectedStop(): void {
    if (this.selectedStop.value != null) this.selectedStopSet.add(this.selectedStop.value);
  }

  addSelecedLine(): void {
    this.addFromSelectedLine(line => line.stopsInbound.concat(line.stopsOutbound));
  }

  addSelecedLineInbound(): void {
    this.addFromSelectedLine(line => line.stopsInbound);
  }

  addSelecedLineOutbound(): void {
    this.addFromSelectedLine(line => line.stopsOutbound);
  }

  private addFromSelectedLine(getStops: (LineData) => StopData[]): void {
    if (this.selectedLine.value != null) {
      getStops(<LineData> this.selectedLine.value).forEach(stop => this.selectedStopSet.add(stop));
      this.selectedStops.emit(this.selectedStopSet);
    }
  }

}
