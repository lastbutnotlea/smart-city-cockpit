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

  selectedStopMap: Map<string, StopData> = new Map();

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
  selectedStopsChanged: EventEmitter<StopData[]> = new EventEmitter<StopData[]>();

  @Input()
  set selectedStops(selectedStops: StopData[]) {
    this.selectedStopMap.clear();
    selectedStops.forEach(s => this.addStop(s));
    this.selectedStopsChanged.emit(selectedStops);
  }

  constructor() {
  }

  removeStop(stop: StopData): void {
    this.selectedStopMap.delete(stop.id);
    this.emitChanged();
  }

  addSelectedStop(): void {
    if (this.selectedStop.value != null) {
      this.addStop(this.selectedStop.value);
      this.emitChanged();
    }
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
      getStops(<LineData> this.selectedLine.value).forEach(stop => this.addStop(stop));
      this.emitChanged();
    }
  }

  private addStop(stop: StopData): void {
    if (stop == null) return;
    this.selectedStopMap.set(stop.id, stop);
  }

  private emitChanged(): void {
    this.selectedStopsChanged.emit(Array.from(this.selectedStopMap.values()));
  }

  getSelectedStops(): StopData[] {
    return Array.from(this.selectedStopMap.values());
  }

}
