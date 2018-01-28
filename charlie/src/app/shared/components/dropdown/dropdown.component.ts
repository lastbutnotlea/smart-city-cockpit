import {
  Component, ElementRef, EventEmitter, HostListener, Input, Output,
  ViewChild
} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

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
export class DropdownComponent {
  @Input()
  values: DropdownValue[];

  @Input()
  selected: DropdownValue;

  @Input()
  width: number = 200;

  @Output()
  selectedChange: EventEmitter<DropdownValue> = new EventEmitter<DropdownValue>();

  @ViewChild('element') component: ElementRef;
  @ViewChild('dropdownButton') button: ElementRef;
  isOpen: boolean = false;

  constructor(private domSanitizer: DomSanitizer) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    // close the dropdown if clicked outside
    const clickedInside = this.component.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  getOffsetTop(): string {
    return this.calculateOffsetTop(this.button.nativeElement) + 'px';
  }

  calculateOffsetTop(el: any): number {
    // because of the necessary absolute positioning we need to calculate the position
    let offset = el.offsetTop;
    return el.offsetParent ? offset + this.calculateOffsetTop(el.offsetParent) : offset;
  }

  getPositionStyle(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle('top: ' + this.getOffsetTop() + '; width: ' + this.width + 'px');
  }

  getWidthStyle(): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle('width: ' + this.width + 'px');
  }

  select(value: DropdownValue): void {
    this.selected = value;
    this.selectedChange.emit(value);
    this.isOpen = false;
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
