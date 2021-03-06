import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TickerData} from '../shared/data/ticker-data';
import {AnnouncementData} from "../shared/data/announcement-data";

@Injectable()
export class UrlBuilderService {
  private baseUrl = environment.backendUrl;
  private networkBaseUrl = this.baseUrl + '/lines';
  private stopBaseUrl = this.baseUrl + '/stops';
  private tripBaseUrl = this.baseUrl + '/trips';
  private vehicleBaseUrl = this.baseUrl + '/vehicles';
  private mapBaseUrl = this.baseUrl + '/map';
  private serviceRequestsBaseUrl = this.baseUrl + '/servicerequests';
  private feedbackBaseUrl = this.baseUrl + '/feedback';
  private announcementBaseUrl = this.baseUrl + '/announcement';
  private tickerBaseUrl = this.baseUrl + '/ticker';
  private eventsBaseUrl = this.baseUrl + '/events';
  private exportBaseUrl = this.baseUrl + '/export';
  private configurationBaseUrl = this.baseUrl + '/configuration';

  public getNetworkUrl(): string {
    return this.networkBaseUrl;
  }

  public getLineDetailsUrl(lineId: string): string {
    return this.networkBaseUrl + '/' + lineId;
  }

  public getStopsUrl(): string {
    return this.stopBaseUrl;
  }

  public getStopSkipUrl(stopId: string): string {
    return this.stopBaseUrl + '/' + stopId + '/skip';
  }

  public getStopUnSkipUrl(stopId: string): string {
    return this.stopBaseUrl + '/' + stopId + '/unskip';
  }

  public getStopDetailsUrl(stopId: string): string {
    return this.stopBaseUrl + '/' + stopId;
  }

  public getVehiclesUrl(): string {
    return this.vehicleBaseUrl;
  }

  public getVehiclesWithCurrentTripUrl(): string {
    return this.vehicleBaseUrl + '/withcurrenttrip';
  }

  public getVehicleDetailsUrl(vehicleId: string): string {
    return this.vehicleBaseUrl + '/' + vehicleId;
  }

  public getTripsUrl(): string {
    return this.tripBaseUrl;
  }

  public getTripDetailsUrl(tripId: string): string {
    return this.tripBaseUrl + '/' + tripId;
  }

  public getMapStationsUrl(): string {
    return this.mapBaseUrl + '/stations';
  }

  public getMapLinesUrl(): string {
    return this.mapBaseUrl + '/lines';
  }

  public getMapConnectionsUrl(): string {
    return this.mapBaseUrl + '/connections';
  }

  public getFilterInfosUrl(): string {
    return this.networkBaseUrl + '/filter-data';
  }

  public getServiceRequestsUrl(): string {
    return this.serviceRequestsBaseUrl;
  }

  public getServiceRequestUrl(id: string): string {
    return this.serviceRequestsBaseUrl + '/' + id;
  }

  public getVehiclePositionInboundUrl(lineId: string): string {
    return this.getLineDetailsUrl(lineId) + '/vehicles/inbound';
  }

  public getVehiclePositionOutboundUrl(lineId: string): string {
    return this.getLineDetailsUrl(lineId) + '/vehicles/outbound';
  }

  public getFeedback(): string {
    return this.feedbackBaseUrl;
  }

  public getVehicleFeedbackUrl(vehicleId: string): string {
    return this.feedbackBaseUrl + '/vehicle/' + vehicleId;
  }

  public getStopFeedbackUrl(stopId: string): string {
    return this.feedbackBaseUrl + '/stop/' + stopId;
  }

  public getFeedbackUrl(feedbackId: string): string {
    return this.feedbackBaseUrl + '/' + feedbackId;
  }

  public getFeedbackProcessUrl(feedbackId: string): string {
    return this.feedbackBaseUrl + '/' + feedbackId + '/process';
  }

  public getFeedbackUnprocessUrl(feedbackId: string): string {
    return this.feedbackBaseUrl + '/' + feedbackId + '/unprocess';
  }

  public getAnnouncementsUrl(): string {
    return this.announcementBaseUrl;
  }

  public getEventsUrl(): string {
    return this.eventsBaseUrl;
  }

  public getEventDetailsUrl(eventId: string): string {
    return this.eventsBaseUrl + '/' + eventId;
  }

  public getInvolvedPartiesUrl(): string {
    return this.eventsBaseUrl + '/people';
  }

  public getTickerUrl(): string {
    return this.tickerBaseUrl;
  }

  public getTickerDeleteUrl(item: TickerData): string {
    return this.tickerBaseUrl + '/' + item.id;
  }

  public getAnnouncementItemUrl(item: AnnouncementData): string {
    return this.announcementBaseUrl + '/' + item.id;
  }

  public getVehiclesStateUrl(): string {
    return this.vehicleBaseUrl + '/state';
  }

  public getNetworkStateUrl(): string {
    return this.mapBaseUrl + '/state';
  }

  public getStopAnnouncementsUrl(stopId: string): string {
    return this.announcementBaseUrl + '/stop/' + stopId;
  }

  public getVehicleServiceRequestsUrl(vehicleId: string): string {
    return this.serviceRequestsBaseUrl + '/vehicle/' + vehicleId;
  }

  public getTripsForStopUrl(stopId: string): string {
    return this.tripBaseUrl + '/stop/' + stopId;
  }

  public getStopServiceRequestsUrl(stopId: string): string {
    return this.serviceRequestsBaseUrl + '/stop/' + stopId;
  }

  public getTripsForVehicleUrl(vehicleId: string): string {
    return this.tripBaseUrl + '/vehicle/' + vehicleId;
  }

  public getExportVehiclesUrl(): string {
    return this.exportBaseUrl + '/vehicles';
  }

  public getExportAnnouncementsUrl(): string {
    return this.exportBaseUrl + '/announcements';
  }

  public getConfigurationCollectionUrl(): string {
    return this.configurationBaseUrl + '/standard';
  }

  public getCurrentConfigurationUrl(): string {
    return this.configurationBaseUrl + '/current';
  }

  public getConfigurationUrl(): string {
    return this.configurationBaseUrl;
  }

  public getVehiclesForTimeAndTypeUrl(date: string, type: string) {
    return this.vehicleBaseUrl + '/type/' + type + '/free-from/' + date;
  }
}
