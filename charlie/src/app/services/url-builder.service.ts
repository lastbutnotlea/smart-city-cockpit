import {Injectable} from '@angular/core';

@Injectable()
export class UrlBuilderService {

  private baseUrl = 'localhost:8080';

  private networkBaseUrl = this.baseUrl + '/lines'

  private tripBaseUrl = this.baseUrl + '/trips';


  public getNetworkUrl(): string {
    console.log(this.networkBaseUrl);
    return this.networkBaseUrl;
  }

  public getLineUrl(lineId: string): string {
    return this.networkBaseUrl + '/' + lineId;
  }

  public getTripsUrl(): string {
    return this.tripBaseUrl;
  }

  public getTripDetailsUrl(tripId: string): string {
    return this.tripBaseUrl + '/' + tripId;
  }
}
