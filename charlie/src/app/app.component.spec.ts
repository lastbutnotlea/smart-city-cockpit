import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FilterTripsPipe} from './pipes/filter-trips.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import { APP_BASE_HREF } from '@angular/common';
import { NetworkComponent } from './view/network/network.component';
import { TripComponent } from './view/trip/trip.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NetworkComponent,
        TripComponent,
        FilterTripsPipe
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
      ],
      providers: [UrlBuilderService, HttpRoutingService, {provide: APP_BASE_HREF, useValue : '/' }]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
});
