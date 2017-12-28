import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class UrlBuilderService {

  private baseUrl = environment.backendUrl;

  private networkBaseUrl = this.baseUrl + '/lines';

  private stopBaseUrl = this.baseUrl + '/stops';

  private tripBaseUrl = this.baseUrl + '/trips';

  private vehicleBaseUrl = this.baseUrl + '/vehicles';

  private mapBaseUrl = this.baseUrl + '/map';

  public getNetworkUrl(): string {
    return this.networkBaseUrl;
  }

  public getLineDetailsUrl(lineId: string): string {
    return this.networkBaseUrl + '/' + lineId;
  }

  public getStopDetailsUrl(stopId: string): string {
    return this.stopBaseUrl + '/' + stopId;
  }

  public getVehiclesUrl(): string {
    return this.vehicleBaseUrl;
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
}
