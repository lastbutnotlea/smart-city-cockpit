import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class UrlBuilderService {
  private baseUrl = environment.backendUrl;
  private networkBaseUrl = this.baseUrl + '/lines';
  private stopBaseUrl = this.baseUrl + '/stops';
  private tripBaseUrl = this.baseUrl + '/trips';
  private vehicleBaseUrl = this.baseUrl + '/vehicles';
  private mapBaseUrl = this.baseUrl + '/map';
  private feedbackBaseUrl = this.baseUrl + '/feedback';
  private announcementBaseUrl = this.baseUrl + '/announcement';
  private eventsBaseUrl = this.baseUrl + '/events';

  public getNetworkUrl(): string {
    return this.networkBaseUrl;
  }

  public getLineDetailsUrl(lineId: string): string {
    return this.networkBaseUrl + '/' + lineId;
  }

  public getStopDetailsUrl(stopId: string): string {
    return this.stopBaseUrl + '/' + stopId;
  }

  public getStopsUrl(): string {
    return this.stopBaseUrl;
  }

  public getVehiclesUrl(): string {
    return this.vehicleBaseUrl;
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

  public getVehiclePositionInboundUrl(lineId: string): string {
    return this.getLineDetailsUrl(lineId) + '/vehicles/inbound';
  }

  public getVehiclePositionOutboundUrl(lineId: string): string {
    return this.getLineDetailsUrl(lineId) + '/vehicles/outbound';
  }

  public getFeedback(): string {
    return this.feedbackBaseUrl;
  }

  public getAnnouncements(): string {
    return this.announcementBaseUrl;
  }

  public getEventsUrl(): string {
    return this.eventsBaseUrl;
  }

  public getEventDetailsUrl(eventId: string): string {
    return this.eventsBaseUrl + '/' + eventId;
  }

  public getInvolvedParteisUrl(): string {
    return this.eventsBaseUrl + '/people';
  }
}
