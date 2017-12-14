package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.*;
import de.team5.super_cute.crocodile.model.*;

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

  public NetworkDataBuilder addLine()
}
