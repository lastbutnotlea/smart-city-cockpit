import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { LineData } from '../shared/line-data';
import { Observable } from 'rxjs/Observable';
import { UrlBuilderService } from './url-builder.service';
import { tap } from 'rxjs/operators';
import { TripData } from '../shared/trip-data';

@Injectable()
export class HttpRoutingService {

  constructor(private http: HttpClient, private urlBuilder: UrlBuilderService) {}

  /**
   * Gets all trip data from backend
   * @returns {Observable<TripData[]>}
   */
  public getTrips (): Observable<TripData[]> {
    return this.http.get<TripData[]>(this.urlBuilder.getTripsUrl())
      .pipe(
        tap(trips => console.log(`Fetched Trips.`))
      );
  }

  /**
   * Gets all trip data from backend
   * @returns {Observable<TripData[]>}
   */
  public getTripDetails (tripId: string): Observable<TripData> {
    return this.http.get<TripData>(this.urlBuilder.getTripDetailsUrl(tripId))
      .pipe(
        tap(trips => console.log(`Fetched Trip Details.`))
      );
  }

  /**
   * Gets all lines from backend
   * @returns {Observable<LineData[]>}
   */
  public getLines (): Observable<LineData[]> {
    return this.http.get<LineData[]>(this.urlBuilder.getNetworkUrl())
      .pipe(
        tap(lines => console.log(`Fetched Lines.`))
      );
  }

  public getMapDataStations (): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapStationsUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Stations.`))
      );
  }

  public getMapDataLines (): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapLinesUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Lines.`))
      );
  }

  public getMapDataConnections (): Observable<any> {
    return this.http.get<any>(this.urlBuilder.getMapConnectionsUrl())
      .pipe(
        tap(data => console.log(`Fetched Map-Data for Connections.`))
      );
  }
}
