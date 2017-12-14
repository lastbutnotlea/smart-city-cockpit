package de.team5.super_cute.crocodile.generator;

import com.fasterxml.jackson.databind.JsonNode;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import sun.util.resources.CalendarData;

public class InitialDataGenerator {

  @Autowired
  private StopData stopData;
  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private LineData lineData;
  @Autowired
  private TripData tripData;

  private ArrayList<String> lineIds = new ArrayList<String>() {{
    add("10");
    add("283");
    add("46");
    add("228");
    add("7");
    add("bakerloo");
    add("hammersmith-city");
    add("jubilee");
    add("victoria");
    add("waterloo-city");
  }};

  NetworkDataBuilder networkDataBuilder = new NetworkDataBuilder(lineData, vehicleData, stopData,
      tripData);

  public void generateInitialPrototypeSetup() {
    ArrayList<Line> lines = new TpDataConnector().getLines(lineIds);
    Calendar from = Calendar.getInstance();
    Calendar to = Calendar.getInstance();
    from.set(Calendar.HOUR, 0);
    from.set(Calendar.MINUTE, 0);
    to.set(Calendar.HOUR, 0);
    to.set(Calendar.MINUTE, 0);
    generateTripsAndVehicles(from, to, lines);
  }

  public void generateTripsAndVehicles(Calendar from, Calendar to, ArrayList<Line> lines) {
    int inboundPointer;
    int outboundPointer;
    RestTemplate rt = new RestTemplate();
    Map<String, Object> params = new HashMap<>();
    for (int x = 0; x < lines.size(); x++) {
      try {
        Calendar iterator = (Calendar) from.clone();
        Calendar inbound = (Calendar) from.clone();
        Calendar outbound = (Calendar) from.clone();
        inboundPointer = 0;
        outboundPointer = 0;
        params.put("id", lineIds.get(x));
        params.put("fromStopPointId", lines.get(x).getStopsInbound().get(0).getId());
        JsonNode node_inbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all", JsonNode.class,
                params);
        params.put("fromStopPointId", lines.get(x).getStopsOutbound().get(0).getId());
        JsonNode node_outbound = rt
            .getForObject("https://api.tfl.gov.uk/Line/{id}/Route/Sequence/all", JsonNode.class,
                params);
        inboundPointer = initializePointer(inboundPointer - 1, node_inbound, inbound, from);
        outboundPointer = initializePointer(outboundPointer - 1, node_outbound, outbound, from);

        while (iterator.compareTo(to) < 1) {

          outbound.set(Calendar.HOUR, node_outbound.get("timetable").get("routes").get(0).get("schedules")
              .get(0)
              .get("knownJourneys").get(outboundPointer).get("hour").asInt());
          outbound.set(Calendar.MINUTE, node_outbound.get("timetable").get("routes").get(0).get("schedules")
              .get(0)
              .get("knownJourneys").get(outboundPointer).get("minute").asInt());

        }
      } catch (Exception e) {
        LoggerFactory.getLogger(getClass()).error("Generating trip failed: " + e.getMessage());
      }
    }
  }

  public int initializePointer(int pointer, JsonNode node, Calendar actual, Calendar from){
    do {
      pointer ++;
      actual.set(Calendar.HOUR, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("hour").asInt());
      actual.set(Calendar.MINUTE, node.get("timetable").get("routes").get(0).get("schedules")
          .get(0)
          .get("knownJourneys").get(pointer).get("minute").asInt());
    } while(from.compareTo(actual) == 1);
    return pointer;
  }
}

