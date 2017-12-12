package de.team5.super_cute.crocodile.crocodile.external;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

public class Trip{

  public Trip(String id, Line line, Vehicle vehicle,
      HashMap<String, Calendar> stops) {
    this.id = id;
    this.line = line;
    this.vehicle = vehicle;
    this.stops = stops;
  }

  public String id;
  public Line line;
  public Vehicle vehicle;
  public HashMap<String, Calendar> stops;
}
