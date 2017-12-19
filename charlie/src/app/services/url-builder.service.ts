import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class UrlBuilderService {

  private baseUrl = environment.backendUrl;

  private networkBaseUrl = this.baseUrl + '/lines';

  private tripBaseUrl = this.baseUrl + '/trips';

  private vehicleBaseUrl = this.baseUrl + '/vehicles';

  public getNetworkUrl(): string {
    return this.networkBaseUrl;
  }

  public getLineUrl(lineId: string): string {
    return this.networkBaseUrl + '/' + lineId;
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
}
