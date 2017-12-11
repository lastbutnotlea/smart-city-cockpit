import {Injectable} from "@angular/core";

@Injectable()
export class UrlBuilderService {

  private baseUrl = 'base/url/';

  private networkBaseUrl = this.baseUrl + 'network/'
  private lineBaseUrl = this.baseUrl + 'line/';

  private tripBaseUrl = this.baseUrl + 'trips/';


  public getNetworkUrl(): string {
    return this.networkBaseUrl;
  }

  public getLineUrl(lineId: string): string {
    return this.lineBaseUrl + lineId;
  }

  public getTripsUrl(): string {
    return this.tripBaseUrl;
  }

  public getTripDetailsUrl(tripId: string): string {
    return this.tripBaseUrl + tripId;
  }
}
