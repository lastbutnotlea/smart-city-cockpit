import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {NetworkComponent} from './view/network/network.component';
import {TripComponent} from './view/trip/trip.component';
import {MenuComponent} from './menu/menu.component';
import {TripDetailComponent} from './view/trip-detail/trip-detail.component';
import {TripEditComponent} from './view/trip-edit/trip-edit.component';
import {FilterComponent} from './shared/components/filter/filter.component';
import {MapComponent} from './view/map/map.component';
import {LineDetailComponent} from './view/line-detail/line-detail.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {UrlBuilderService} from './services/url-builder.service';
import {HttpRoutingService} from './services/http-routing.service';
import {MapCreatorService} from './services/map-creator.service';
import {APP_BASE_HREF} from '@angular/common';
import {DropdownComponent} from './shared/components/dropdown/dropdown.component';
import {EmbeddedLineComponent} from './shared/components/embedded-line/embedded-line.component';
import {EmbeddedVehicleComponent} from './shared/components/embedded-vehicle/embedded-vehicle.component';
import {ConfirmDeletionComponent} from './shared/components/confirm-popup/confirm-deletion.component';
import {StopSortService} from './services/stop-sort.service';
import {TripEditDepartureComponent} from './view/trip-edit-departure/trip-edit-departure.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NetworkComponent,
        TripComponent,
        MenuComponent,
        TripDetailComponent,
        TripEditComponent,
        TripEditDepartureComponent,
        FilterComponent,
        MapComponent,
        LineDetailComponent,
        DropdownComponent,
        EmbeddedLineComponent,
        EmbeddedVehicleComponent,
        ConfirmDeletionComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
      ],
      providers: [
        UrlBuilderService,
        HttpRoutingService,
        MapCreatorService,
        StopSortService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
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
