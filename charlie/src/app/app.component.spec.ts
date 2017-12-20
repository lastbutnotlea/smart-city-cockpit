import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import { APP_BASE_HREF } from '@angular/common';
import { NetworkComponent } from './view/network/network.component';
import { TripComponent } from './view/trip/trip.component';
import { TripDetailComponent } from './view/trip-detail/trip-detail.component';
import {FilterComponent} from './view/filter/filter.component';
import {MenuComponent} from './menu/menu.component';
import { MapComponent } from './view/map/map.component';
import { LineDetailComponent } from './view/line-detail/line-detail.component';
import { MapCreatorService } from './services/map-creator.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NetworkComponent,
        TripComponent,
        MenuComponent,
        TripDetailComponent,
        FilterComponent,
        MapComponent,
        LineDetailComponent,
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
      ],
      providers: [UrlBuilderService, HttpRoutingService, MapCreatorService, {provide: APP_BASE_HREF, useValue : '/' }]
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
});
