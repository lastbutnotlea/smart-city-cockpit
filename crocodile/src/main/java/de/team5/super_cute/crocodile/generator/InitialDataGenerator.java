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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
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
    from.set(Calendar.HOUR, fromHour);
    from.set(Calendar.MINUTE, fromMinute);
    to.set(Calendar.HOUR, toHour);
    to.set(Calendar.MINUTE,toMinute);
    generateTripsAndVehicles(from, to, lines);
  }

  public void generateTripsAndVehicles(Calendar from, Calendar to, ArrayList<Line> lines) {
    int inboundPointer;
    int outboundPointer;
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    linien:
    for (int x = 0; x < lines.size(); x++) {
      try {
        Line line = lines.get(x);
        networkDataBuilder.addLinesWithStops(line);
        int inboundTravelTime = line.getTravelTimeInbound().values().stream().max(Integer::compareTo).orElse(-1);
        int outboundTravelTime = line.getTravelTimeOutbound().values().stream().max(Integer::compareTo).orElse(-1);
        PriorityQueue<Pair<Vehicle, Calendar>> queueInbound = new PriorityQueue<>((a,b) -> a.getValue().compareTo(b.getValue()));
        PriorityQueue<Pair<Vehicle, Calendar>> queueOutbound = new PriorityQueue<>((a,b) -> a.getValue().compareTo(b.getValue()));
        Calendar iterator = (Calendar) from.clone();
        Calendar nextTripInbound = (Calendar) from.clone();
        Calendar nextTripOutbound = (Calendar) from.clone();
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
        inboundPointer = initializePointer(inboundPointer, node_inbound, nextTripInbound, from);
        outboundPointer = initializePointer(outboundPointer, node_outbound, nextTripOutbound, from);

        while (true) {
          if(nextTripInbound.compareTo(nextTripOutbound) < 1){
            iterator = (Calendar) nextTripInbound.clone();
            Vehicle vehicle;
            if(queueInbound.peek() == null || queueInbound.peek().getValue().compareTo(iterator) == 1){
              //If no (or no available) vehicle exists: create new one
              vehicle = new Vehicle(100, 0, 42, new HashSet<>(), EVehicleType.Bus);
              networkDataBuilder.addVehicles(vehicle);
            }
            else{
              vehicle = queueInbound.poll().getKey();
            }
            networkDataBuilder.addTrip(vehicle, line, (Calendar) iterator.clone(), true);
            Calendar ready = (Calendar) iterator.clone();
            ready.add(Calendar.MINUTE, inboundTravelTime);
            queueOutbound.add(new ImmutablePair<>(vehicle, ready));
            inboundPointer++;
            if(inboundPointer == node_inbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").size()){
              continue linien;
            }
            nextTripInbound.set(Calendar.HOUR, node_inbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").get(inboundPointer).get("hour").asInt());
            nextTripInbound.set(Calendar.MINUTE, node_inbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").get(inboundPointer).get("minute").asInt());
          }
          else{
            iterator = (Calendar) nextTripOutbound.clone();
            Vehicle vehicle;
            if(queueOutbound.peek() == null || queueOutbound.peek().getValue().compareTo(iterator) == 1){
              vehicle = new Vehicle(100, 0, 42, new HashSet<>(), EVehicleType.Bus);
              networkDataBuilder.addVehicles(vehicle);
            }
            else{
              vehicle = queueOutbound.poll().getKey();
            }
            networkDataBuilder.addTrip(vehicle, line, (Calendar) iterator.clone(), false);
            Calendar ready = (Calendar) iterator.clone();
            ready.add(Calendar.MINUTE, outboundTravelTime);
            queueInbound.add(new ImmutablePair<>(vehicle, ready));
            outboundPointer++;
            if(outboundPointer == node_outbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").size()) {
              continue linien;
            }
            nextTripOutbound.set(Calendar.HOUR, node_outbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").get(outboundPointer).get("hour").asInt());
            nextTripOutbound.set(Calendar.MINUTE, node_outbound.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").get(outboundPointer).get("minute").asInt());
          }
          if(iterator.compareTo(to) == 1)
            break;
        }
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Generating trip failed: " + e.getMessage());
      }
    }
  }

  public int initializePointer(int pointer, JsonNode node, Calendar actual, Calendar from){
    do {
      actual.set(Calendar.HOUR, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("hour").asInt());
      actual.set(Calendar.MINUTE, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("minute").asInt());
      pointer ++;
    } while(from.compareTo(actual) == 1);
    return pointer;
  }
}

