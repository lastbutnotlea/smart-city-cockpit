import {LineData} from '../shared/data/line-data';
import {Observable} from 'rxjs/Observable';
import {UrlBuilderService} from './url-builder.service';
import {tap} from 'rxjs/operators';
import {TripData} from '../shared/data/trip-data';
import {VehicleData} from '../shared/data/vehicle-data';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StopData} from '../shared/data/stop-data';
import 'rxjs/add/operator/map';
import { LinePositionData } from '../shared/data/line-position-data';
import {FeedbackData} from '../shared/data/feedback-data';
import {AnnouncementData} from '../shared/data/announcement-data';
import {EventData} from '../shared/data/event-data';

@Injectable()
export class HttpRoutingService {

  constructor(private http: HttpClient, private urlBuilder: UrlBuilderService) {
  }

  /**
   * Gets all trip data from backend
   * @returns {Observable<TripData[]>}
   */
  public getTrips(): Observable<TripData[]> {
    return this.http.get<TripData[]>(this.urlBuilder.getTripsUrl())
      .pipe(
        tap(trips => console.log(`Fetched Trips.`))
      );
  }

  /**
   * Gets data for trip with tripId from backend
   * @returns {Observable<TripData[]>}
   */
  public getTripDetails(tripId: string): Observable<TripData> {
    return this.http.get<TripData>(this.urlBuilder.getTripDetailsUrl(tripId))
      .pipe(
        tap(trip => console.log(`Fetched Trip Details.`))
      );
  }

  /**
   * Gets all lines from backend
   * @returns {Observable<LineData[]>}
   */
  public getLines(): Observable<LineData[]> {
    return this.http.get<LineData[]>(this.urlBuilder.getNetworkUrl())
      .pipe(
        tap(lines => console.log(`Fetched Lines.`))
      );
  }

  /**
   * Gets data for line with lineId from backend
   * @returns {Observable<LineData[]>}
   */
  public getLineDetails(lineId: string): Observable<LineData> {
    return this.http.get<LineData>(this.urlBuilder.getLineDetailsUrl(lineId))
      .pipe(
        tap(line => console.log(`Fetched Line Details.`))
      );
  }

  /**
   * Gets data for stop with line
   * @param {string} lineId
   * @param {string} stopId
   * @returns {Observable<StopData>}
   */
  public getStopDetails(stopId: string): Observable<StopData> {
    return this.http.get<StopData>(this.urlBuilder.getStopDetailsUrl(stopId))
      .pipe(
        tap(stop => console.log('Fetched Stop Details'))
      );
  }

  public getStops(): Observable<StopData[]> {
    return this.http.get<StopData[]>(this.urlBuilder.getStopsUrl());
  }

  public getMapDataStations(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapStationsUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Stations.`))
      );
  }

  public getMapDataLines(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapLinesUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Lines.`))
      );
  }

  public getMapDataConnections(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapConnectionsUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Connections.`))
      );
  }

  public getVehicles(): Observable<VehicleData[]> {
    return this.http.get<VehicleData[]>(this.urlBuilder.getVehiclesUrl());
  }

  public getVehicle(vehicleId: string): Observable<VehicleData> {
    return this.http.get<VehicleData>(this.urlBuilder.getVehicleDetailsUrl(vehicleId));
  }

  public deleteVehicle(vehicleId: string): Observable<any> {
    return this.http.delete(this.urlBuilder.getVehicleDetailsUrl(vehicleId));
  }

  public addVehicle(vehicle: VehicleData): Observable<any> {
    return this.http.post(this.urlBuilder.getVehiclesUrl(), vehicle);
  }

  public getVehicleTypes(): Observable<string[]> {
    return this.getFilterData().map(data => data.types);
  }

  public addTrip(trip: TripData): Observable<any> {
    return this.http.post(this.urlBuilder.getTripsUrl(), trip);
  }

  public editTrip(trip: TripData): Observable<any> {
    return this.http.put(this.urlBuilder.getTripsUrl(), trip).pipe(tap(data =>
      console.log('EDIT TRIP OK')));
  }

  public deleteTrip(tripId: string): Observable<any> {
    return this.http.delete(this.urlBuilder.getTripDetailsUrl(tripId));
  }

  public getFilterData(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getFilterInfosUrl()).
      pipe(
        tap(data => console.log('Data for filters: ' + data))
    );
  }

  public getVehiclePositionInboundData(lineData: string): Observable<LinePositionData> {
    return this.http.get<LinePositionData>(this.urlBuilder.getVehiclePositionInboundUrl(lineData));
  }

  public getVehiclePositionOutboundData(lineData: string): Observable<LinePositionData> {
    return this.http.get<LinePositionData>(this.urlBuilder.getVehiclePositionOutboundUrl(lineData));
  }

  public getFeedback(): Observable<FeedbackData[]> {
    return this.http.get<FeedbackData[]>(this.urlBuilder.getFeedback());
  }

  public getAnnouncements(): Observable<any []> {
    return this.http.get<any []>(this.urlBuilder.getAnnouncements());
  }

  public addAnnouncement(announcement: AnnouncementData): Observable<any> {
    return this.http.post<any>(this.urlBuilder.getAnnouncements(), announcement);
  }

  public getEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(this.urlBuilder.getEventsUrl());
  }

  public getEventDetails(eventId: string): Observable<EventData> {
    return this.http.get<EventData>(this.urlBuilder.getEventDetailsUrl(eventId));
  }

  public addEvent(event: EventData): Observable<any> {
    return this.http.post<any>(this.urlBuilder.getEventsUrl(), event);
  }

  public editEvent(event: EventData): Observable<any> {
    return this.http.put<any>(this.urlBuilder.getEventsUrl(), event);
  }
}
