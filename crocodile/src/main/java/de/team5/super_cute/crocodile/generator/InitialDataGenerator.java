package de.team5.super_cute.crocodile.generator;

import static de.team5.super_cute.crocodile.util.InitialSetupConfig.lineIds;

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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import javafx.util.Pair;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
    Calendar from = Calendar.getInstance();
    Calendar to = Calendar.getInstance();
    from.set(Calendar.HOUR, 0);
    from.set(Calendar.MINUTE, 0);
    to.set(Calendar.HOUR, 23);
    to.set(Calendar.MINUTE, 59);
    generateTripsAndVehicles(from, to, lines);
  }

  public void generateTripsAndVehicles(Calendar from, Calendar to, ArrayList<Line> lines) {
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
        PriorityQueue<Pair<Vehicle, Calendar>> queueInbound = new PriorityQueue<>(
            (a, b) -> a.getValue().compareTo(b.getValue()));
        PriorityQueue<Pair<Vehicle, Calendar>> queueOutbound = new PriorityQueue<>(
            (a, b) -> a.getValue().compareTo(b.getValue()));
        Calendar iterator = (Calendar) from.clone();
        Calendar nextTripInbound = (Calendar) from.clone();
        Calendar nextTripOutbound = (Calendar) from.clone();
        inboundPointer = 0;
        outboundPointer = 0;
        params.put("id", lineIds.get(x));
        params.put("fromStopPointId", lines.get(x).getStopsInbound().get(0).getId());
        JsonNode node_inbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                params);
        params.put("fromStopPointId", lines.get(x).getStopsOutbound().get(0).getId());
        JsonNode node_outbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}",
                JsonNode.class,
                params);
        inboundPointer = initializePointer(inboundPointer - 1, node_inbound, nextTripInbound, from);
        outboundPointer = initializePointer(outboundPointer - 1, node_outbound, nextTripOutbound, from);

        while (true) {
          //determines if the next departure is inbound or outbound
          if (nextTripInbound.compareTo(nextTripOutbound) < 1) {
            inboundPointer = generateTrip(iterator, nextTripInbound, queueInbound, queueOutbound, line, node_inbound,
                inboundPointer, inboundTravelTime);
            if(inboundPointer == -1){
              continue lines;
            }
          } else {
            outboundPointer = generateTrip(iterator, nextTripOutbound, queueOutbound, queueInbound, line,
                node_outbound, outboundPointer, outboundTravelTime);
            if(outboundPointer == -1){
              continue lines;
            }
          }
          //if from > to
          if (iterator.compareTo(to) == 1) {
            break;
          }
        }
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Generating trip failed: " + e.getMessage());
      }
    }
  }

  //sets the pointer to the first departure after from
  private int initializePointer(int pointer, JsonNode node, Calendar actual, Calendar from) {
    do {
      pointer++;
      actual.set(Calendar.HOUR, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("hour").asInt());
      actual.set(Calendar.MINUTE, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("minute").asInt());
    } while (from.compareTo(actual) == 1);
    return pointer;
  }

  private int generateTrip(Calendar iterator, Calendar nextTrip,
      PriorityQueue<Pair<Vehicle, Calendar>> queueFrom,
      PriorityQueue<Pair<Vehicle, Calendar>> queueTo, Line line, JsonNode node, int pointer,
      int travelTime) {
    iterator = (Calendar) nextTrip.clone();
    Vehicle vehicle;
    if (queueFrom.peek() == null || queueFrom.peek().getValue().compareTo(iterator) == 1) {
      //If no (or no available) vehicle exists: create new one
      vehicle = new Vehicle(100, 0, 42, new HashSet<>(), EVehicleType.Bus);
      networkDataBuilder.addVehicles(vehicle);
    } else {
      vehicle = queueFrom.poll().getKey();
    }
    networkDataBuilder.addTrip(vehicle, line, (Calendar) iterator.clone(), true);
    //determines when the vehicle is available again and puts vehicle in queue
    Calendar ready = (Calendar) iterator.clone();
    ready.add(Calendar.MINUTE, travelTime);
    queueTo.add(new Pair<>(vehicle, ready));
    pointer++;
    if (pointer == node.get("timetable").get("routes").get(0).get("schedules")
        .get(0)
        .get("knownJourneys").size()) {
      return -1;
    }
    //get next departure
    nextTrip.set(Calendar.HOUR, node.get("timetable").get("routes").get(0).get("schedules")
        .get(0)
        .get("knownJourneys").get(pointer).get("hour").asInt());
    nextTrip.set(Calendar.MINUTE, node.get("timetable").get("routes").get(0).get("schedules")
        .get(0)
        .get("knownJourneys").get(pointer).get("minute").asInt());
    return pointer;
  }
}

