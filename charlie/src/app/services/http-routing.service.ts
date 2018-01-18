import {LineData} from '../shared/data/line-data';
import {Observable} from 'rxjs/Observable';
import {UrlBuilderService} from './url-builder.service';
import {TripData} from '../shared/data/trip-data';
import {VehicleData} from '../shared/data/vehicle-data';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StopData} from '../shared/data/stop-data';
import 'rxjs/add/operator/map';
import { ServiceRequestData } from '../shared/data/service-request-data';
import { LinePositionData } from '../shared/data/line-position-data';
import {FeedbackData} from '../shared/data/feedback-data';
import {TickerData} from '../shared/data/ticker-data';
import {AnnouncementData} from '../shared/data/announcement-data';
import {LineForStopData} from "../shared/data/LineForStopData";

@Injectable()
export class HttpRoutingService {

  constructor(private http: HttpClient, private urlBuilder: UrlBuilderService) {
  }

  /**
   * Gets all trip data from backend
   * @returns {Observable<TripData[]>}
   */
  public getTrips(): Observable<TripData[]> {
    return this.http.get<TripData[]>(this.urlBuilder.getTripsUrl());
  }

  /**
   * Gets data for trip with tripId from backend
   * @returns {Observable<TripData[]>}
   */
  public getTripDetails(tripId: string): Observable<TripData> {
    return this.http.get<TripData>(this.urlBuilder.getTripDetailsUrl(tripId));
  }

  /**
   * Gets all lines from backend
   * @returns {Observable<LineData[]>}
   */
  public getLines(): Observable<LineData[]> {
    return this.http.get<LineData[]>(this.urlBuilder.getNetworkUrl());
  }

  /**
   * Gets data for line with lineId from backend
   * @returns {Observable<LineData[]>}
   */
  public getLineDetails(lineId: string): Observable<LineData> {
    return this.http.get<LineData>(this.urlBuilder.getLineDetailsUrl(lineId));
  }

  /**
   * Gets data for stop with line
   * @param {string} lineId
   * @param {string} stopId
   * @returns {Observable<StopData>}
   */
  public getStopDetails(stopId: string): Observable<StopData> {
    return this.http.get<StopData>(this.urlBuilder.getStopDetailsUrl(stopId));
  }

  public getStops(): Observable<StopData[]> {
    return this.http.get<StopData[]>(this.urlBuilder.getStopsUrl());
  }

  public getLineForStop(stopId: string): Observable<LineForStopData[]> {
    return this.http.get<LineForStopData[]>(this.urlBuilder.getStopDetailsUrl(stopId) + '/lines');
  }

  public getMapDataStations(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapStationsUrl());
  }

  public getMapDataLines(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapLinesUrl());
  }

  public getMapDataConnections(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapConnectionsUrl());
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
    return this.http.put(this.urlBuilder.getTripsUrl(), trip);
  }

  public processFeedback(feedback: FeedbackData): Observable<any> {
    return this.http.put(this.urlBuilder.getStopFeedbackUrl(), feedback);
  }

  public deleteTrip(tripId: string): Observable<any> {
    return this.http.delete(this.urlBuilder.getTripDetailsUrl(tripId));
  }

  public getFilterData(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getFilterInfosUrl());
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

  public getServiceRequests(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getServiceRequestsUrl());
  }


  public getServiceRequestDetails(id: string): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getServiceRequestUrl(id));
  }

  public addServiceRequest(serviceRequest: ServiceRequestData): Observable<any> {
    return this.http.post(this.urlBuilder.getServiceRequestsUrl(), serviceRequest);
  }

  public editServiceRequest(serviceRequest: ServiceRequestData): Observable<any> {
    return this.http.put(this.urlBuilder.getServiceRequestsUrl(), serviceRequest);
  }

  public deleteServiceRequest(id: string): Observable<any> {
    return this.http.delete(this.urlBuilder.getServiceRequestUrl(id));
  }

  public getVehicleFeedback(vehicleId: string): Observable<FeedbackData[]> {
    return this.http.get<FeedbackData[]>(this.urlBuilder.getVehicleFeedbackUrl(vehicleId));
  }

  public getStopFeedback(stopId: string): Observable<FeedbackData[]> {
    return this.http.get<FeedbackData[]>(this.urlBuilder.getStopFeedbackUrl(stopId));
  }

  public getTickerItems(): Observable<TickerData []> {
    return this.http.get<TickerData []>(this.urlBuilder.getTickerUrl());
  }

  public deleteTickerItem(data: TickerData): Observable<any> {
    return this.http.delete<any>(this.urlBuilder.getTickerDeleteUrl(data));
  }

  public getAnnouncements(): Observable<any []> {
    return this.http.get<any []>(this.urlBuilder.getAnnouncements());
  }

  public addAnnouncement(announcement: AnnouncementData): Observable<any> {
    return this.http.post<any>(this.urlBuilder.getAnnouncements(), announcement);
  }

  public getVehiclesState(): Observable<string> {
    return this.http.get<string>(this.urlBuilder.getVehiclesStateUrl());
  }

  public getNetworkState(): Observable<string> {
    return this.http.get<string>(this.urlBuilder.getNetworkStateUrl());
  }

  public getStopAnnouncements(stopId: string): Observable<AnnouncementData[]> {
    return this.http.get<AnnouncementData[]>(this.urlBuilder.getStopAnnouncementsUrl(stopId));
  }
}
