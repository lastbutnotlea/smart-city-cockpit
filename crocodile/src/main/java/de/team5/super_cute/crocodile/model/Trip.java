package de.team5.super_cute.crocodile.model;

import java.util.Calendar;
import java.util.Dictionary;

public class Trip extends IdentifiableObject {

  private Vehicle vehicle;
  private Line line;
  private Dictionary<Stop, Calendar> stops;

  public Trip() {}

  public Trip(Vehicle vehicle, Line line,
      Dictionary<Stop, Calendar> stops) {
    super();
    this.vehicle = vehicle;
    this.line = line;
    this.stops = stops;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public Line getLine() {
    return line;
  }

  public void setLine(Line line) {
    this.line = line;
  }

  public Dictionary<Stop, Calendar> getStops() {
    return stops;
  }

  public void setStops(
      Dictionary<Stop, Calendar> stops) {
    this.stops = stops;
  }
}
