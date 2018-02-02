package de.team5.super_cute.crocodile.external;

import static de.team5.super_cute.crocodile.config.ColorMapping.LINE_COLORS;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.PEOPLE_WAITING_INITIAL_MAX;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.PEOPLE_WAITING_INITIAL_MIN;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.APP_ID;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.APP_KEY;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;

import java.util.*;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class TpDataConnector {

  public List<Line> getLines(@NotNull @NotEmpty List<String> lineIds) {
    return lineIds.parallelStream().map(id -> {
      try {
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("app_id", APP_ID);
        params.put("app_key", APP_KEY);
        RestTemplate rt = new RestTemplate();
        JsonNode node = rt.getForObject(
            "https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all?APP_ID={APP_ID}&APP_KEY={APP_KEY}",
            JsonNode.class,
            params);
        List<Stop> stopsInbound = new ArrayList<>();
        List<Stop> stopsOutbound = new ArrayList<>();
        getStopsFromNode(node, stopsInbound, stopsOutbound);
        Map<String, Integer> travelTimeInbound = getTravelTimes(node, stopsInbound);
        Map<String, Integer> travelTimeOutbound = getTravelTimes(node, stopsOutbound);
        // Bus line ids are always only numbers
        EVehicleType type = id.matches("\\d+") ? EVehicleType.BUS : EVehicleType.SUBWAY;
        return new Line(node.get("lineName").asText(), stopsInbound,
            stopsOutbound, travelTimeInbound, travelTimeOutbound,
            LINE_COLORS.get(node.get("lineName").asText()), type);
      } catch (RestClientException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing Transport-API while creating lines: " + e.getMessage());
      } catch (NullPointerException | IllegalArgumentException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing JsonNode while creating lines: " + e.getMessage());
      }
      return null; // filter this later
    }).filter(Objects::nonNull).collect(Collectors.toList());
  }

  //maps stops to their delay from start-stop
  private Map<String, Integer> getTravelTimes(JsonNode node, List<Stop> stops) {
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    params.put("id", node.get("lineId").asText());
    params.put("fromStopPointId", stops.get(0).getId());
    params.put("app_id", APP_ID);
    params.put("app_key", APP_KEY);
    JsonNode node_travelTime = rt.getForObject(
        "https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?APP_ID={APP_ID}&APP_KEY={APP_KEY}",
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

  private void getStopsFromNode(JsonNode node, List<Stop> stopsInbound,
      List<Stop> stopsOutbound) throws IllegalArgumentException {
    for (int i = 0; i < node.get("stopPointSequences").size(); i++) {
      //first sequence is inbound, second is outbound
      for (int x = 0; x < node.get("stopPointSequences").get(i).get("stopPoint").size(); x++) {
        //iterate over all stops and create objects
        Random r = new Random(System.currentTimeMillis());
        JsonNode stopNode = node.get("stopPointSequences").get(i).get("stopPoint").get(x);
        Stop stop = new Stop(stopNode.get("id").asText(), stopNode.get("name").asText(),
            stopNode.get("lon").asDouble(), stopNode.get("lat").asDouble(),
            r.nextInt(PEOPLE_WAITING_INITIAL_MAX - PEOPLE_WAITING_INITIAL_MIN + 1)
                + PEOPLE_WAITING_INITIAL_MIN, new HashSet<>());
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
