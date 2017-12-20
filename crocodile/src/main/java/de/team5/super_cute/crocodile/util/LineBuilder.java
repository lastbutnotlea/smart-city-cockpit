package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import java.awt.Color;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Hashtable;
import java.util.Map;

public class LineBuilder {

  private Line line;

  public LineBuilder() {
    line = new Line();
  }

  public LineBuilder name(String name) {
    line.setName(name);
    return this;
  }

  public LineBuilder color(Color color) {
    line.setColor(color);
    return this;
  }

  /**
   * @param stops the inbound stops for this line. They are reversed and used for outbound.
   * @return
   */
  public LineBuilder stops(Stop... stops) {
    ArrayList<Stop> stopsList = new ArrayList<>(Arrays.asList(stops));
    line.setStopsInbound(stopsList);
    Collections.reverse(stopsList);
    line.setStopsOutbound(stopsList);
    return this;
  }

  /**
   * @param travelTime the inbound travel times from the start stop. Times are reversed for outbound travel time.
   * @return
   */
  public LineBuilder travelTime(Integer... travelTime) {
    if (line.getStopsInbound().isEmpty()) {
      throw new RuntimeException("Please add stops before travel time!");
    }
    Integer max = travelTime[travelTime.length - 1];
    int numStops = line.getStopsInbound().size();
    Map<String, Integer> travelTimeInbound = new Hashtable<>();
    Map<String, Integer> travelTimeOutbound = new Hashtable<>();
    for (int i = 0; i < numStops; i++) {
      travelTimeInbound.put(line.getStopsInbound().get(i).getId(), travelTime[i]);
      travelTimeOutbound.put(line.getStopsOutbound().get(numStops - i - 1).getId(), max - travelTime[i]);
    }
    line.setTravelTimeInbound(travelTimeInbound);
    line.setTravelTimeOutbound(travelTimeOutbound);
    return this;
  }

  public Line build() {
    return line;
  }
}