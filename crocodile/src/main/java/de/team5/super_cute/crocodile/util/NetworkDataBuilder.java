package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class NetworkDataBuilder {

  private LineData lineData;
  private VehicleData vehicleData;
  private StopData stopData;
  private TripData tripData;

  public NetworkDataBuilder(LineData lineData,
      VehicleData vehicleData, StopData stopData,
      TripData tripData) {
    this.lineData = lineData;
    this.vehicleData = vehicleData;
    this.stopData = stopData;
    this.tripData = tripData;
  }

  /*public NetworkDataBuilder addStops(Stop... stops) {
    for (Stop s : stops) {
      stopData.addObject(s);
    }
    return this;
  }

  public NetworkDataBuilder addLines(Line... lines) {
    for (Line l : lines) {
      lineData.addObject(l);
    }
    return this;
  }

  public NetworkDataBuilder addVehicles(Vehicle... vehicles) {
    for (Vehicle v : vehicles) {
      vehicleData.addObject(v);
    }
    return this;
  }

  *//**
   * Adds simple trips that go along the whole line.
   * @param vehicle
   * @param line
   * @return
   */
  public NetworkDataBuilder addTrip(Vehicle vehicle, Line line, Calendar startTime, boolean inbound) {
    /*Trip trip = new Trip(vehicle, line, null);
    Map<String, Calendar> stops = new HashMap<>();
    if (inbound) {
      for (int i = 0; i < line.getStopsInbound().size(); i++) {
        stops.put(line.getStopsInbound().get(i).getId(), startTime.add(Calendar.MINUTE, ))
      }
    }*/
    return null;
  }


}
