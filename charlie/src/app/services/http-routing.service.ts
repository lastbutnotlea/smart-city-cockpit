import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { LineData } from '../shared/line-data';
import { Observable } from 'rxjs/Observable';
import { UrlBuilderService } from './url-builder.service';
import { catchError, tap } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { TripData } from '../shared/trip-data';
import {VehicleData} from '../shared/vehicle-data';

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
        // TODO: Error Handling!
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
        // TODO: Error Handling!
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
        // TODO: Error Handling!
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
