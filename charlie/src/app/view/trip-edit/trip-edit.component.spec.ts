import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripEditComponent } from './trip-edit.component';
import {DropdownComponent} from '../../shared/components/dropdown/dropdown.component';

describe('TripEditComponent', () => {
  let component: TripEditComponent;
  let fixture: ComponentFixture<TripEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TripEditComponent,
        DropdownComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Fix Frontend Tests!
/*  it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
