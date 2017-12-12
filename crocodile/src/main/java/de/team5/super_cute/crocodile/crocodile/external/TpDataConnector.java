package de.team5.super_cute.crocodile.crocodile.external;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

public class TpDataConnector {

  private static final String APP_ID = "eec7bc0d";
  private static final String APP_KEY = "d865ba51ed52b80e33bdb8fc65619d87";

  public ArrayList<Stop> getStops(List<String> ids) {
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
   /* for (int i = 0; i < naptanIds.size(); i = i + 20) {
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
    }*/

    return stops;
  }

  public ArrayList<Line> getLines(List<String> lineIds) {
    ArrayList<Line> lines = new ArrayList<Line>();
    RestTemplate rt = new RestTemplate();
    for (String id : lineIds) {
      ArrayList<Stop> stopsInbound = new ArrayList<Stop>();
      ArrayList<Stop> stopsOutbound = new ArrayList<Stop>();
      try {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        JsonNode node = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all", JsonNode.class,
                params);
        for (int i = 0; i < node.get("stopPointSequences").size(); i++) {
          for (int x = 0; x < node.get("stopPointSequences").get(i).get("stopPoint").size(); x++) {
            Stop stop = new Stop(
                node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("stationId")
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
        lines.add(
            new Line(node.get("lineId").asText(), node.get("lineName").asText(), null, stopsInbound,
                stopsOutbound));
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Loading line failed: " + e.getMessage());
      }
    }
    return lines;
  }

  public Trip getTrip(String lineId, Vehicle vehicle, List<String> stopIds, Calendar starttime) {
    RestTemplate rt = new RestTemplate();
    HashMap<String, Calendar> stops = new HashMap<>();
    try {
      Map<String, Object> params = new HashMap<>();
      params.put("id", lineId);
      params.put("fromStopPointId", stopIds.get(0));
      JsonNode node = rt
          .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
              JsonNode.class,
              params);
      stops.put(stopIds.get(0), (Calendar) starttime.clone());
      int stopcount = 1;
      for (int i = 0;
          i < node.get("timetable").get("routes").get(0).get("stationIntervals").get(0).get("intervals")
              .size(); i++) {
        if (stopcount >= stopIds.size()) {
          break;
        }
        if (node.get("timetable").get("routes").get(0).get("stationIntervals").get(0).get("intervals")
            .get(i).get("stopId").asText().equals(
                stopIds.get(stopcount))) {
          Calendar time = (Calendar) starttime.clone();
          time.add(Calendar.MINUTE, node.get("timetable").get("routes").get(0).get("stationIntervals").get(0).get("intervals")
              .get(i).get("timeToArrival").asInt());
          stops.put(stopIds.get(stopcount), time);
          stopcount ++;
        }
      }
    } catch (Exception e) {
      LoggerFactory.getLogger(getClass()).error("Loading trip failed: " + e.getMessage());
    }
    return new Trip("id", getLines(new ArrayList<String>(){{add(lineId);}}).get(0), vehicle, stops);
  }
}
