package de.team5.super_cute.crocodile.generator;


import static de.team5.super_cute.crocodile.config.InitialSetupConfig.fromHour;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.fromMinute;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.lineIds;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.toHour;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.toMinute;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_id;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_key;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class InitialDataGenerator {

  @Autowired
  private StopData stopData;
  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private LineData lineData;
  @Autowired
  private TripData tripData;


  private NetworkDataBuilder networkDataBuilder;

  public void generateInitialPrototypeSetup() {
    networkDataBuilder = new NetworkDataBuilder(lineData, vehicleData, stopData,
        tripData);
    ArrayList<Line> lines = new TpDataConnector().getLines(lineIds);
    LocalDateTime from = LocalDateTime.now();
    LocalDateTime to = LocalDateTime.now();
    from = from.withHour(fromHour);
    from = from.withMinute(fromMinute);
    to = to.withHour(fromHour);
    to = to.withMinute(fromMinute);
    generateTripsAndVehicles(from, to, lines);
  }

  public void generateTripsAndVehicles(LocalDateTime from, LocalDateTime to, ArrayList<Line> lines) {
    int inboundPointer;
    int outboundPointer;
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    lines:
    for (int x = 0; x < lines.size(); x++) {
      try {
        Line line = lines.get(x);
        networkDataBuilder.addLinesWithStops(line);
        int inboundTravelTime = line.getTravelTimeInbound().values().stream()
            .max(Integer::compareTo).orElse(-1);
        int outboundTravelTime = line.getTravelTimeOutbound().values().stream()
            .max(Integer::compareTo).orElse(-1);
        PriorityQueue<Pair<Vehicle, LocalDateTime>> queueInbound = new PriorityQueue<>(
            (a, b) -> a.getValue().compareTo(b.getValue()));
        PriorityQueue<Pair<Vehicle, LocalDateTime>> queueOutbound = new PriorityQueue<>(
            (a, b) -> a.getValue().compareTo(b.getValue()));
        LocalDateTime iterator = LocalDateTime.from(from);
        LocalDateTime nextTripInbound = LocalDateTime.from(from);
        LocalDateTime nextTripOutbound = LocalDateTime.from(from);
        inboundPointer = 0;
        outboundPointer = 0;
        params.put("id", lineIds.get(x));
        params.put("fromStopPointId", lines.get(x).getStopsInbound().get(0).getId());
        params.put("app_id", app_id);
        params.put("app_key", app_key);
        JsonNode node_inbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?app_id={app_id}&app_key={app_key}", JsonNode.class,
                params);
        params.put("fromStopPointId", lines.get(x).getStopsOutbound().get(0).getId());
        JsonNode node_outbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?app_id={app_id}&app_key={app_key}", JsonNode.class,
                params);
        inboundPointer = initializePointer(inboundPointer - 1, node_inbound, nextTripInbound, from);
        outboundPointer = initializePointer(outboundPointer - 1, node_outbound, nextTripOutbound,
            from);
        System.out.println("FROM " + from);
        System.out.println("TO " + to);
        System.out.println("IN " + nextTripInbound);
        System.out.println("OUT " + nextTripOutbound);
        if (nextTripInbound.compareTo(nextTripOutbound) < 1) {
          iterator = LocalDateTime.from(nextTripInbound);
        } else {
          iterator = LocalDateTime.from(nextTripOutbound);
        }
        while (iterator.compareTo(to) != 1 && inboundPointer != -1 && outboundPointer != -1) {
          //determines if the next departure is inbound or outbound
          if (nextTripInbound.compareTo(iterator) == 0) {
            inboundPointer = generateTrip(iterator, nextTripInbound, queueInbound, queueOutbound,
                line, node_inbound, inboundPointer, inboundTravelTime);
          } else {
            outboundPointer = generateTrip(iterator, nextTripOutbound, queueOutbound, queueInbound,
                line, node_outbound, outboundPointer, outboundTravelTime);
          }
          if (nextTripInbound.compareTo(nextTripOutbound) < 1) {
            iterator = LocalDateTime.from(nextTripInbound);
          } else {
            iterator = LocalDateTime.from(nextTripOutbound);
          }
          System.out.println("TO " + to);
          System.out.println("IT " + iterator);
          //if iterator > to break
        }
      } catch (RestClientException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing Transport-API while creating trips: " + e.getMessage());
      } catch (NullPointerException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing JsonNode while creating trips: " + e.getMessage());
      }
    }
  }

  //sets the pointer to the first departure after from
  private int initializePointer(int pointer, JsonNode node, LocalDateTime actual, LocalDateTime from) {
    do {
      pointer++;
      actual = actual.withHour(node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("hour").asInt());
      actual = actual.withMinute(node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("minute").asInt());
    } while (from.compareTo(actual) == 1);
    return pointer;
  }

  //returns the pointer to the next departure in JsonNode or -1 if iterated over all departures
  private int generateTrip(LocalDateTime iterator, LocalDateTime nextTrip,
      PriorityQueue<Pair<Vehicle, LocalDateTime>> queueFrom,
      PriorityQueue<Pair<Vehicle, LocalDateTime>> queueTo, Line line, JsonNode node, int pointer,
      int travelTime) {
    Vehicle vehicle;
    if (queueFrom.peek() == null || queueFrom.peek().getValue().compareTo(iterator) == 1) {
      //If no (or no available) vehicle exists: create new one
      vehicle = new Vehicle(100, 0, 42, new HashSet<>(), EVehicleType.Bus);
      networkDataBuilder.addVehicles(vehicle);
    } else {
      vehicle = queueFrom.poll().getKey();
    }
    networkDataBuilder.addTrip(vehicle, line, LocalDateTime.from(iterator), true);
    //determines when the vehicle is available again and puts vehicle in queue
    LocalDateTime ready = LocalDateTime.from(iterator);
    ready = ready.plusMinutes(travelTime);
    queueTo.add(new ImmutablePair<>(vehicle, ready));
    pointer++;
    JsonNode knownJourneys = node.get("timetable").get("routes").get(0).get("schedules").get(0)
        .get("knownJourneys");
    if (pointer == knownJourneys.size()) {
      return -1;
    }
    //get next departure
    nextTrip = nextTrip.withHour(knownJourneys.get(pointer).get("hour").asInt());
    nextTrip = nextTrip.withMinute(knownJourneys.get(pointer).get("minute").asInt());
    return pointer;
  }
}

