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
