import { LineData } from '../shared/data/line-data';
import { Observable } from 'rxjs/Observable';
import { UrlBuilderService } from './url-builder.service';
import { tap } from 'rxjs/operators';
import { TripData } from '../shared/data/trip-data';
import {VehicleData} from '../shared/data/vehicle-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
   * Gets data for trip with tripId from backend
   * @returns {Observable<TripData[]>}
   */
  public getTripDetails (tripId: string): Observable<TripData> {
    return this.http.get<TripData>(this.urlBuilder.getTripDetailsUrl(tripId))
      .pipe(
        tap(trip => console.log(`Fetched Trip Details.`))
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

  /**
   * Gets data for line with lineId from backend
   * @returns {Observable<LineData[]>}
   */
  public getLineDetails (lineId: string): Observable<LineData> {
    return this.http.get<LineData>(this.urlBuilder.getLineDetailsUrl(lineId))
      .pipe(
        tap(line => console.log(`Fetched Line Details.`))
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

  public getVehicles (): Observable<VehicleData[]> {
    return this.http.get<VehicleData[]>(this.urlBuilder.getVehiclesUrl()).
      pipe(
        tap(vehicles => console.log('Fetches vehicles.'))
    );
  }

  public addTrip(trip: TripData): void {
    console.log('ADD TRIP, lineID: ' + trip.line.id + ' vehicleID: ' + trip.vehicle.id);
    this.http.post(this.urlBuilder.getTripsUrl(), trip).subscribe();
  }

  public editTrip(trip: TripData): void {
    console.log('EDIT TRIP, lineID: ' + trip.line.id + ' vehicleID: ' + trip.vehicle.id);
    this.http.put(this.urlBuilder.getTripsUrl(), trip).subscribe(() => console.log('TRIP EDIT OK'));
  }
}
