package de.team5.super_cute.crocodile.external;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

public class TpDataConnector {

  public ArrayList<Line> getLines(@NotNull @NotEmpty List<String> lineIds) {
    ArrayList<Line> lines = new ArrayList<Line>();
    RestTemplate rt = new RestTemplate();
    for (String id : lineIds) {
      ArrayList<Stop> stopsInbound = new ArrayList<Stop>();
      ArrayList<Stop> stopsOutbound = new ArrayList<Stop>();
      Map<String, Integer> travelTimeInbound;
      Map<String, Integer> travelTimeOutbound;
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
        Map<String, Object> paramsTravelTimeInbound = new HashMap<>();
        paramsTravelTimeInbound.put("id", node.get("lineId").asText());
        paramsTravelTimeInbound.put("fromStopPointId", stopsInbound.get(0).getId());
        JsonNode node_travelTime = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                paramsTravelTimeInbound);
        travelTimeInbound = getTravelTimes(node_travelTime, stopsInbound.size());

        //generate travelTimeOutbound
        Map<String, Object> paramsTravelTimeOutbound = new HashMap<>();
        paramsTravelTimeOutbound.put("id", node.get("lineId").asText());
        paramsTravelTimeOutbound.put("fromStopPointId", stopsOutbound.get(0).getId());
        node_travelTime = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                paramsTravelTimeOutbound);
        travelTimeOutbound = getTravelTimes(node_travelTime, stopsOutbound.size());
        lines.add(
            new Line(node.get("lineName").asText(), stopsInbound,
                stopsOutbound, travelTimeInbound, travelTimeOutbound, new Color(0)));
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Loading line failed: " + e.getMessage());
      }
    }
    return lines;
  }

  private Map<String, Integer> getTravelTimes(JsonNode node, Integer stopsSize) {
    Map<String, Integer> travelTime = new HashMap<>();
    JsonNode stationIntervals = node.get("timetable").get("routes").get(0).get("stationIntervals");
    for (int x = 0; x < stationIntervals.size(); x++) {
      if (travelTime.size() == stopsSize) {
        break;
      }
      for (int i = 0;
          i < stationIntervals.get(x).get("intervals").size(); i++) {
        travelTime.put(
            stationIntervals.get(x).get("intervals").get(i).get("stopId").asText(),
            stationIntervals.get(x).get("intervals").get(i).get("timeToArrival").asInt());
      }
      travelTime
          .put(node.get("timetable").get("departureStopId").asText(), 0);
    }
    return travelTime;
  }
}
