import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  DropdownValue, selectDropdown,
  toDropdownItems
} from "../../../../shared/components/dropdown/dropdown.component";
import {StopData} from "../../../../shared/data/stop-data";
import {LineData} from "../../../../shared/data/line-data";
import {isNullOrUndefined} from "util";
import {StringFormatterService} from '../../../../services/string-formatter.service';

@Component({
  selector: 'app-edit-announcement-stops',
  templateUrl: './edit-announcement-stops.component.html',
  styleUrls: ['./edit-announcement-stops.component.css']
})
export class EditAnnouncementStopsComponent {
  availableStops: DropdownValue[] = [];
  selectedStop: DropdownValue = selectDropdown;

  availableLines: DropdownValue[] = [];
  selectedLine: DropdownValue = selectDropdown;
  availableDirections: DropdownValue[] = [];
  selectedDirection: DropdownValue = selectDropdown;

  selectedStopMap: Map<string, StopData> = new Map();

  constructor(private stringFormatter: StringFormatterService){

  }

  @Input()
  set stops(stops: StopData[]) {
    this.availableStops = toDropdownItems(stops, item => this.stringFormatter.toStopId(item));
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
    if (this.selectedDirection.value) {
      this.addFromSelectedLine(line => line.stopsInbound);
    } else {
      this.addFromSelectedLine(line => line.stopsOutbound);
    }
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

  getEndOfSelectedLine(): string {
    if (isNullOrUndefined(this.selectedDirection.value)) {
      return "?";
    } else {
      let stops = this.getStopsFromSelectedLine(this.selectedDirection.value);
      return stops[stops.length - 1].commonName;
    }
  }

  lineChanged(line: DropdownValue): void {
    this.selectedLine = line;
    this.availableDirections = [
      new DropdownValue(true, this.getStopsFromSelectedLine(true)[0].commonName),
      new DropdownValue(false, this.getStopsFromSelectedLine(false)[0].commonName)
    ];
    this.selectedDirection = selectDropdown;
  }

  getStopsFromSelectedLine(inbound: boolean): StopData[] {
    return (inbound) ? this.selectedLine.value.stopsInbound : this.selectedLine.value.stopsOutbound;
  }

  removeAllStops() {
    this.selectedStopMap.clear();
    this.emitChanged();
  }
}
