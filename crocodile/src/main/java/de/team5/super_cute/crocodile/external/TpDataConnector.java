package de.team5.super_cute.crocodile.external;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.awt.Color;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

public class TpDataConnector {

  private static final String APP_ID = "eec7bc0d";
  private static final String APP_KEY = "d865ba51ed52b80e33bdb8fc65619d87";

  /*public ArrayList<Stop> getStops(@NotNull @NotEmpty List<String> ids) {
    ArrayList<Stop> stops = new ArrayList<Stop>();
    RestTemplate rt = new RestTemplate();
    String url = "";
    for (String id : ids) {
      try {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        JsonNode node = rt
            .getForObject("https://api.tfl.gov.uk/StopPoint/{id}", JsonNode.class,
                params);
        stops.add(new Stop(node.get("stationNaptan").asText(), node.get("commonName").asText(),
            node.get("lon").asDouble(), node.get("lat").asDouble(), 0));
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Loading stop failed: " + e.getMessage());
      }
    }
    //Lösung in der mehrere ids pro Abfrage abgefragt werden (funktioniert aber nicht)
   *//* for (int i = 0; i < naptanIds.size(); i = i + 20) {
      url = "https://api.tfl.gov.uk/StopPoint/";
      for (int x = 0; x < naptanIds.size() && x < 20; x++) {
        if (x != 0) {
          url += "%2C";
        }
        url += naptanIds.get(i + x);
      }
    }
    //url += "?&app_id=" + APP_ID + "&app_key=" + APP_KEY;
    try {
      JsonNode node = rt.getForObject(url, JsonNode.class);
      //for(int i = 0; i < node.size(); i++){
      stops.add(new Stop(node.get("stationNaptan").asText(), node.get("commonName").asText(),
          node.get("lon").asDouble(), node.get("lat").asDouble(), 0));
      //}
    } catch (Exception e) {
      LoggerFactory.getLogger(getClass()).info("Loading line failed: " + e.getMessage());
    }*//*

    return stops;
  }*/

  public ArrayList<Line> getLines(@NotNull @NotEmpty List<String> lineIds) {
    ArrayList<Line> lines = new ArrayList<Line>();
    RestTemplate rt = new RestTemplate();
    for (String id : lineIds) {
      ArrayList<Stop> stopsInbound = new ArrayList<Stop>();
      ArrayList<Stop> stopsOutbound = new ArrayList<Stop>();
      Dictionary<String, Integer> travelTimeInbound = new Hashtable<>();
      Dictionary<String, Integer> travelTimeOutbound = new Hashtable<>();
      try {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        JsonNode node = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all", JsonNode.class,
                params);
        for (int i = 0; i < node.get("stopPointSequences").size(); i++) {
          for (int x = 0; x < node.get("stopPointSequences").get(i).get("stopPoint").size(); x++) {
            Stop stop = new Stop(
                node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("id")
                    .asText(),
                node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("name").asText(),
                node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("lon").asDouble(),
                node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("lat").asDouble(),
                0);
            if (node.get("stopPointSequences").get(i).get("direction").asText().equals("inbound")) {
              stopsInbound.add(stop);
            } else if (node.get("stopPointSequences").get(i).get("direction").asText()
                .equals("outbound")) {
              stopsOutbound.add(stop);
            } else {
              throw new Exception("Wrong direction");
            }
          }
        }
        //generate travelTimeInbound
        params = new HashMap<>();
        params.put("id", node.get("lineId").asText());
        params.put("fromStopPointId", stopsInbound.get(0).getApiIp());
        JsonNode node_travelTime = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                params);
        travelTimeInbound.put(node_travelTime.get("timetable").get("departureStopId").asText(), 0);
        for (int i = 0;
            i < node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
                .get("intervals")
                .size(); i++) {
            travelTimeInbound.put(node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
                .get("intervals")
                .get(i).get("stopId").asText(), node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
                .get("intervals")
                .get(i).get("timeToArrival").asInt());
        }

        //generate travelTimeOutbound
        params = new HashMap<>();
        params.put("id", node.get("lineId").asText());
        params.put("fromStopPointId", stopsOutbound.get(0).getApiIp());
        node_travelTime = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                params);
        travelTimeOutbound.put(node_travelTime.get("timetable").get("departureStopId").asText(), 0);
        for (int i = 0;
            i < node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
                .get("intervals")
                .size(); i++) {
          travelTimeOutbound.put(node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
              .get("intervals")
              .get(i).get("stopId").asText(), node_travelTime.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
              .get("intervals")
              .get(i).get("timeToArrival").asInt());
        }

        lines.add(
            new Line(node.get("lineName").asText(), stopsInbound,
                stopsOutbound, travelTimeInbound, travelTimeOutbound, new Color(0)));
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Loading line failed: " + e.getMessage());
      }
    }
    return lines;
  }

  /*public Trip getTrip(@NotNull Line line, @NotNull Vehicle vehicle,
      @NotNull @NotEmpty List<String> stopIds, @NotNull Calendar starttime) {
    RestTemplate rt = new RestTemplate();
    Dictionary<String, Calendar> stops = new Hashtable<>();
    Calendar time;
    try {
      Map<String, Object> params = new HashMap<>();
      params.put("id", line.getName());
      params.put("fromStopPointId", stopIds.get(0));
      JsonNode node = rt
          .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
              JsonNode.class,
              params);
      stops.put(stopIds.get(0), (Calendar) starttime.clone());
      int stopcount = 1;
      for (int i = 0;
          i < node.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
              .get("intervals")
              .size(); i++) {
        if (stopcount >= stopIds.size()) {
          break;
        }
        if (node.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
            .get("intervals")
            .get(i).get("stopId").asText().equals(
                stopIds.get(stopcount))) {
          time = (Calendar) starttime.clone();
          System.out.println(time.getTime());
          time.add(Calendar.MINUTE,
              node.get("timetable").get("routes").get(0).get("stationIntervals").get(0)
                  .get("intervals")
                  .get(i).get("timeToArrival").asInt());
          System.out.println(time.getTime());
          stops.put(stopIds.get(stopcount), time);
          stopcount++;
        }
      }
      if(stopcount < stopIds.size()){
        throw new Exception("At least one stop not found");
      }
    } catch (Exception e) {
      LoggerFactory.getLogger(getClass()).error("Loading trip failed: " + e.getMessage());
    }
    return new Trip(vehicle, line, stops);
  }*/
}
