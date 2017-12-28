import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TickerComponent} from './ticker.component';
import {TickerItemComponent} from '../ticker-item/ticker-item.component';

describe('TickerComponent', () => {
  let component: TickerComponent;
  let fixture: ComponentFixture<TickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TickerComponent, TickerItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
