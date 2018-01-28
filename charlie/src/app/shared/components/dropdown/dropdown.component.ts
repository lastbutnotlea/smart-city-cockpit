import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export class DropdownValue {
  readonly value: any;
  readonly label: string;
  constructor(value: any, label: string) {
    this.value = value;
    this.label = label;
  }
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  @Input()
  values: DropdownValue[];

  @Input()
  selected: DropdownValue;

  @Output()
  selectedChange: EventEmitter<DropdownValue> = new EventEmitter<DropdownValue>();

  ngOnInit(): void {}

  constructor() {
    this.selectedChange.subscribe(value => this.selected = value);
  }

  select(value: DropdownValue): void {
    this.selectedChange.emit(value);
  }
}

export function toDropdownItems(values: any[], label: (any) => string): DropdownValue[] {
  return values.map(value => toDropdownItem(value, label));
}

export function toDropdownItem(value: any, label: (any) => string): DropdownValue {
  return new DropdownValue(value, label(value));
}

export function priorityDropdownItems(): DropdownValue[] {
  let prioItems: DropdownValue[] = [];
  prioItems.push(new DropdownValue('FINE', 'Low'));
  prioItems.push(new DropdownValue('PROBLEMATIC', 'Medium'));
  prioItems.push(new DropdownValue('CRITICAL', 'High'));
  return prioItems;
}

export const loadingDropdown: DropdownValue = new DropdownValue(null, "loading...");
export const selectDropdown: DropdownValue = new DropdownValue(null, "please select");
