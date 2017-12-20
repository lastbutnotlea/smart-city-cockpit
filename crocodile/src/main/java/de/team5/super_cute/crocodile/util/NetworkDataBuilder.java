package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class aims to help you creating a Network with consistent Data for e.g. Testing
 */
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

  public NetworkDataBuilder addStops(Stop... stops) {
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

  public NetworkDataBuilder addLinesWithStops(Line... lines) {
    for (Line l : lines) {
      for (Stop s : l.getStopsInbound()){
        stopData.addObject(s);
      }
      for (Stop s : l.getStopsOutbound()){
        stopData.addObject(s);
      }
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

  /**
   * Adds simple trips that go along the whole line.
   * @param vehicle
   * @param line
   * @return
   */
  public NetworkDataBuilder addTrip(Vehicle vehicle, Line line, Calendar startTime, boolean inbound) {
    Trip trip = assembleWholeLineTrip(vehicle, line, startTime, inbound);
    tripData.addObject(trip);
    return this;
  }

  public static Trip assembleWholeLineTrip(Vehicle vehicle, Line line, Calendar startTime, boolean inbound) {
    Trip trip = new Trip(vehicle, line, null);
    Map<String, Calendar> stops = new HashMap<>();
    if (inbound) {
      addStopsForOneDirection(stops, line.getStopsInbound(), line.getTravelTimeInbound(), startTime);
    } else {
      addStopsForOneDirection(stops, line.getStopsOutbound(), line.getTravelTimeOutbound(), startTime);
    }
    trip.setStops(stops);
    return trip;
  }

  @SuppressWarnings("UnnecessaryLocalVariable")
  private static void addStopsForOneDirection(Map<String, Calendar> tripStops, List<Stop> lineStops, Map<String, Integer> travelTime, Calendar startTime) {
    for (Stop currentStop : lineStops) {
      Calendar currentStopTime = startTime;
      currentStopTime.add(Calendar.MINUTE, travelTime.get(currentStop.getId()));
      tripStops.put(currentStop.getId(), currentStopTime);
    }
  }

  public void build() {}
}
