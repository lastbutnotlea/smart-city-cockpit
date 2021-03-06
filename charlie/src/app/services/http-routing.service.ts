import {LineData} from '../shared/data/line-data';
import {Observable} from 'rxjs/Observable';
import {UrlBuilderService} from './url-builder.service';
import {TripData} from '../shared/data/trip-data';
import {VehicleData} from '../shared/data/vehicle-data';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StopData} from '../shared/data/stop-data';
import 'rxjs/add/operator/map';
import {ServiceRequestData} from '../shared/data/service-request-data';
import {LinePositionData} from '../shared/data/line-position-data';
import {FeedbackData} from '../shared/data/feedback-data';
import {TickerData} from '../shared/data/ticker-data';
import {AnnouncementData} from '../shared/data/announcement-data';
import {SkipData} from "../shared/data/skip-data";
import {EventData} from '../shared/data/event-data';
import {PartyData} from '../shared/data/party-data';
import {LineForStopData} from "../shared/data/line-for-stop-data";
import {LiveDataConfigurationCollection} from '../shared/data/live-data-configuration-collection';
import {LiveDataConfiguration} from '../shared/data/live-data-configuration';
import {isNullOrUndefined} from "util";

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

  public getVehiclesWithCurrentTrip(): Observable<VehicleData[]> {
    return this.http.get<VehicleData[]>(this.urlBuilder.getVehiclesWithCurrentTripUrl());
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

  public processFeedback(feedbackId: string): Observable<any> {
    return this.http.put(this.urlBuilder.getFeedbackProcessUrl(feedbackId), feedbackId);
  }

  public unprocessFeedback(feedbackId: string): Observable<any> {
    return this.http.put(this.urlBuilder.getFeedbackUnprocessUrl(feedbackId), feedbackId);
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

  public skipStop(stopId: string, skipData: SkipData): Observable<any> {
    return this.http.post(this.urlBuilder.getStopSkipUrl(stopId), skipData);
  }

  public unSkipStop(stopId: string, skipData: SkipData): Observable<any> {
    return this.http.post(this.urlBuilder.getStopUnSkipUrl(stopId), skipData);
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
    return this.http.get<any []>(this.urlBuilder.getAnnouncementsUrl());
  }

  public addAnnouncement(announcement: AnnouncementData): Observable<any> {
    return this.http.post(this.urlBuilder.getAnnouncementsUrl(), announcement);
  }

  public deleteAnnouncement(data: AnnouncementData): Observable<any> {
    return this.http.delete(this.urlBuilder.getAnnouncementItemUrl(data));
  }

  public editAnnouncement(data: AnnouncementData): Observable<any> {
    return this.http.put(this.urlBuilder.getAnnouncementsUrl(), data);
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

  public deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(this.urlBuilder.getEventDetailsUrl(eventId));
  }

  public getInvolvedParties(): Observable<PartyData[]> {
    return this.http.get<PartyData[]>(this.urlBuilder.getInvolvedPartiesUrl());
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

  public getTripsForStop(stopId: string): Observable<TripData[]> {
    return this.http.get<TripData[]>(this.urlBuilder.getTripsForStopUrl(stopId));
  }

  public getTripsForVehicle(vehicleId: string): Observable<TripData[]> {
    return this.http.get<TripData[]>(this.urlBuilder.getTripsForVehicleUrl(vehicleId));
  }

  public getVehicleServiceRequests(vehicleId: string): Observable<ServiceRequestData[]> {
    return this.http.get<ServiceRequestData[]>(this.urlBuilder.getVehicleServiceRequestsUrl(vehicleId));
  }

  public getStopServiceRequests(stopId: string): Observable<ServiceRequestData[]> {
    return this.http.get<ServiceRequestData[]>(this.urlBuilder.getStopServiceRequestsUrl(stopId));
  }

  public getVehiclesExport(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getExportVehiclesUrl());
  }

  public getAnnouncementsExport(): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getExportAnnouncementsUrl());
  }

  public getConfigurationCollection(): Observable<LiveDataConfigurationCollection> {
    return this.http.get<LiveDataConfigurationCollection>(this.urlBuilder.getConfigurationCollectionUrl());
  }

  public getCurrentConfiguration(): Observable<LiveDataConfiguration> {
    return this.http.get<LiveDataConfiguration>(this.urlBuilder.getCurrentConfigurationUrl());
  }

  public editConfiguration(configuration: LiveDataConfiguration): Observable<any> {
    return this.http.post<any>(this.urlBuilder.getConfigurationUrl(), configuration);
  }

  getVehiclesByTimeAndType(date: string, type: string, ignoredTrip: TripData) {
    let param = new HttpParams();
    if (!isNullOrUndefined(ignoredTrip)) param = param.append('ignoreTripId', ignoredTrip.id);
    return this.http.get<VehicleData[]>(
      this.urlBuilder.getVehiclesForTimeAndTypeUrl(date, type), {params: param});
  }
}
