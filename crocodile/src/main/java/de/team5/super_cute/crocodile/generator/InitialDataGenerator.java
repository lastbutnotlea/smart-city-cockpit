package de.team5.super_cute.crocodile.generator;


import static de.team5.super_cute.crocodile.config.AppConfiguration.TIMEZONE;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.INITIALIZE_FOR_MINUTES;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.INITIALIZE_SINCE_MINUTES;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.LINEIDS;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_id;
import static de.team5.super_cute.crocodile.config.TfLApiConfig.app_key;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import javax.annotation.PostConstruct;
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

  @PostConstruct
  public void generateInitialPrototypeSetup() {
    networkDataBuilder = new NetworkDataBuilder(lineData, vehicleData, stopData,
        tripData);
    LoggerFactory.getLogger(getClass())
        .info("Started initialization");
    List<Line> lines = new TpDataConnector().getLines(LINEIDS);
    LocalDateTime from = LocalDateTime.now(TIMEZONE).minusMinutes(INITIALIZE_SINCE_MINUTES);
    LocalDateTime to = LocalDateTime.now(TIMEZONE).plusMinutes(INITIALIZE_FOR_MINUTES);
    generateTripsAndVehicles(from, to, lines);
    LoggerFactory.getLogger(getClass())
        .info("Finished initialization");
  }

  public void generateTripsAndVehicles(LocalDateTime from, LocalDateTime to,
      List<Line> lines) {
    int inboundPointer;
    int outboundPointer;
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    for (int x = 0; x < lines.size(); x++) {
      try {
        Line line = lines.get(x);
        if (lineData.exists(line.getName())) {
          continue;
        }
        networkDataBuilder.addLinesWithStops(line);
        int inboundTravelTime = line.getTravelTimeInbound().values().stream()
            .max(Integer::compareTo).orElse(-1);
        int outboundTravelTime = line.getTravelTimeOutbound().values().stream()
            .max(Integer::compareTo).orElse(-1);
        //noinspection ComparatorCombinators
        PriorityQueue<Pair<Vehicle, LocalDateTime>> queueInbound = new PriorityQueue<>(
            Comparator.comparing(Pair::getValue));
        PriorityQueue<Pair<Vehicle, LocalDateTime>> queueOutbound = new PriorityQueue<>(
            Comparator.comparing(Pair::getValue));
        MyLocalDateTime iterator = new MyLocalDateTime(LocalDateTime.from(from));
        MyLocalDateTime nextTripInbound = new MyLocalDateTime(LocalDateTime.from(from));
        MyLocalDateTime nextTripOutbound = new MyLocalDateTime(LocalDateTime.from(from));
        inboundPointer = 0;
        outboundPointer = 0;
        params.put("id", LINEIDS.get(x));
        params.put("fromStopPointId", lines.get(x).getStopsInbound().get(0).getId());
        params.put("app_id", app_id);
        params.put("app_key", app_key);
        JsonNode node_inbound = rt
            .getForObject(
                "https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?app_id={app_id}&app_key={app_key}",
                JsonNode.class,
                params);
        params.put("fromStopPointId", lines.get(x).getStopsOutbound().get(0).getId());
        JsonNode node_outbound = rt
            .getForObject(
                "https://api.tfl.gov.uk/Line/{id}/Timetable/{fromStopPointId}?app_id={app_id}&app_key={app_key}",
                JsonNode.class,
                params);
        inboundPointer = initializePointer(inboundPointer - 1, node_inbound, nextTripInbound, from);
        outboundPointer = initializePointer(outboundPointer - 1, node_outbound, nextTripOutbound,
            from);
        if (nextTripInbound.getLocalDateTime().compareTo(nextTripOutbound.getLocalDateTime()) < 1) {
          iterator.setLocalDateTime(LocalDateTime.from(nextTripInbound.getLocalDateTime()));
        } else {
          iterator.setLocalDateTime(LocalDateTime.from(nextTripOutbound.getLocalDateTime()));
        }
        while (iterator.getLocalDateTime().compareTo(to) != 1 && inboundPointer != -1
            && outboundPointer != -1) {
          //determines if the next departure is inbound or outbound
          if (nextTripInbound.getLocalDateTime().compareTo(iterator.getLocalDateTime()) == 0) {
            inboundPointer = generateTrip(iterator.getLocalDateTime(), nextTripInbound,
                queueInbound, queueOutbound,
                line, node_inbound, inboundPointer, inboundTravelTime, true);
          } else {
            outboundPointer = generateTrip(iterator.getLocalDateTime(), nextTripOutbound,
                queueOutbound, queueInbound,
                line, node_outbound, outboundPointer, outboundTravelTime, false);
          }
          if (nextTripInbound.getLocalDateTime().compareTo(nextTripOutbound.getLocalDateTime())
              < 1) {
            iterator.setLocalDateTime(LocalDateTime.from(nextTripInbound.getLocalDateTime()));
          } else {
            iterator.setLocalDateTime(LocalDateTime.from(nextTripOutbound.getLocalDateTime()));
          }
          //if iterator > to break
        }
      } catch (RestClientException e) {
        LoggerFactory.getLogger(getClass())
            .error("Error while accessing Transport-API while creating trips: " + e.getMessage());
      }
    }
  }

  //sets the pointer to the first departure after from
  private int initializePointer(int pointer, JsonNode node, MyLocalDateTime actual,
      LocalDateTime from) {
    try {
      do {
        pointer++;
        int oldHour = actual.getLocalDateTime().getHour();
        int newHour = node.get("timetable").get("routes").get(0).get("schedules")
            .get(0)
            .get("knownJourneys").get(pointer).get("hour").asInt();
        if (newHour == 24) {
          newHour = 0;
        }
        actual.setLocalDateTime(actual.getLocalDateTime()
            .withHour(newHour)
            .withMinute(node.get("timetable").get("routes").get(0).get("schedules")
                .get(0)
                .get("knownJourneys").get(pointer).get("minute").asInt()));
        if (oldHour > actual.getLocalDateTime().getHour() && pointer > 0) {
          actual.setLocalDateTime(actual.getLocalDateTime().plusDays(1));
          break;
        }
      } while (from.compareTo(actual.getLocalDateTime()) == 1);
    } catch (NullPointerException e) {
      actual.setLocalDateTime(actual.getLocalDateTime().plusDays(1));
    }
    return pointer;
  }

  //returns the pointer to the next departure in JsonNode or -1 if iterated over all departures
  private int generateTrip(LocalDateTime iterator, MyLocalDateTime nextTrip,
      PriorityQueue<Pair<Vehicle, LocalDateTime>> queueFrom,
      PriorityQueue<Pair<Vehicle, LocalDateTime>> queueTo, Line line, JsonNode node, int pointer,
      int travelTime, boolean isInbound) {
    Vehicle vehicle;
    if (queueFrom.peek() == null || queueFrom.peek().getValue().compareTo(iterator) == 1) {
      //If no (or no available) vehicle exists: create new one
      vehicle = Vehicle.createRandom(line.getType());
      networkDataBuilder.addVehicles(vehicle);
    } else {
      vehicle = queueFrom.poll().getKey();
    }
    networkDataBuilder.addTrip(vehicle, line, LocalDateTime.from(iterator), isInbound);
    //determines when the vehicle is available again and puts vehicle in queue
    LocalDateTime ready = iterator.plusMinutes(travelTime);
    queueTo.add(new ImmutablePair<>(vehicle, ready));
    pointer++;
    JsonNode knownJourneys = node.get("timetable").get("routes").get(0).get("schedules").get(0)
        .get("knownJourneys");
    if (pointer == knownJourneys.size()) {
      return -1;
    }
    //get next departure
    int hour = knownJourneys.get(pointer).get("hour").asInt();
    if (hour == 24) {
      nextTrip.setLocalDateTime(nextTrip.getLocalDateTime().plusDays(1));
      hour = 0;
    }
    nextTrip.setLocalDateTime(
        nextTrip.getLocalDateTime().withHour(hour)
            .withMinute(knownJourneys.get(pointer).get("minute").asInt()));
    return pointer;
  }

  private static class MyLocalDateTime {

    private LocalDateTime localDateTime;

    public MyLocalDateTime(LocalDateTime localDateTime) {
      this.localDateTime = localDateTime;
    }

    public LocalDateTime getLocalDateTime() {
      return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
      this.localDateTime = localDateTime;
    }
  }
}



