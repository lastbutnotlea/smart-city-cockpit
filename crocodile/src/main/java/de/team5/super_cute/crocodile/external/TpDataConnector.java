package de.team5.super_cute.crocodile.external;

import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_id;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_key;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import java.awt.Color;
import java.util.*;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestClientException;
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
        params.put("app_id", app_id);
        params.put("app_key", app_key);
        JsonNode node = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all?app_id={app_id}&app_key={app_key}", JsonNode.class,
                params);
        getStopsFromNode(node, stopsInbound, stopsOutbound);
        travelTimeInbound = getTravelTimes(node, stopsInbound);
        travelTimeOutbound = getTravelTimes(node, stopsOutbound);
        lines.add(
            new Line(node.get("lineName").asText(), stopsInbound,
                stopsOutbound, travelTimeInbound, travelTimeOutbound, new Color(0)));
      } catch (RestClientException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing Transport-API while creating lines: " + e.getMessage());
      } catch (NullPointerException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing JsonNode while creating lines: " + e.getMessage());
      } catch (IllegalArgumentException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing JsonNode while creating lines: " + e.getMessage());
      }
    }
    return lines;
  }

  //maps stops to their delay from start-stop
  private Map<String, Integer> getTravelTimes(JsonNode node, ArrayList<Stop> stops) {
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    params.put("id", node.get("lineId").asText());
    params.put("fromStopPointId", stops.get(0).getId());
    params.put("app_id", app_id);
    params.put("app_key", app_key);
    JsonNode node_travelTime = rt
        .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?app_id={app_id}&app_key={app_key}",
            JsonNode.class,
            params);
    Map<String, Integer> travelTime = new HashMap<>();
    JsonNode stationIntervals = node_travelTime.get("timetable").get("routes").get(0)
        .get("stationIntervals");
    for (int x = 0; x < stationIntervals.size(); x++) {
      if (travelTime.size() == stops.size()) {
        break;
      }
      JsonNode intervals = stationIntervals.get(x).get("intervals");
      for (int i = 0; i < intervals.size(); i++) {
        travelTime.put(intervals.get(i).get("stopId").asText(),
            intervals.get(i).get("timeToArrival").asInt());
      }
      travelTime.put(node_travelTime.get("timetable").get("departureStopId").asText(), 0);
    }
    return travelTime;
  }

  private void getStopsFromNode(JsonNode node, ArrayList<Stop> stopsInbound,
      ArrayList<Stop> stopsOutbound) throws IllegalArgumentException {
    for (int i = 0; i < node.get("stopPointSequences").size(); i++) {
      //first sequence is inbound, second is outbound
      for (int x = 0; x < node.get("stopPointSequences").get(i).get("stopPoint").size(); x++) {
        //iterate over all stops and create objects
        Stop stop = new Stop(
            node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("id")
                .asText(),
            node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("name").asText(),
            node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("lon").asDouble(),
            node.get("stopPointSequences").get(i).get("stopPoint").get(x).get("lat").asDouble(),
            300, new HashSet<>());
        if (node.get("stopPointSequences").get(i).get("direction").asText().equals("inbound")) {
          stopsInbound.add(stop);
        } else if (node.get("stopPointSequences").get(i).get("direction").asText()
            .equals("outbound")) {
          stopsOutbound.add(stop);
        } else {
          throw new IllegalArgumentException("Invalid direction in JsonNode");
        }
      }
    }
  }
}
