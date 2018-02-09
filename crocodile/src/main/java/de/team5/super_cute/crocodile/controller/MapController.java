package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.util.Collection;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/map")
public class MapController {

  private Logger logger = LoggerFactory.getLogger(this.getClass());
  private LineData lineData;
  private StopData stopData;
  private VehicleData vehicleData;
  private ObjectMapper mapper;

  @Autowired
  public MapController(LineData lineData, StopData stopData, VehicleData vehicleData) {
    this.lineData = lineData;
    this.stopData = stopData;
    this.vehicleData = vehicleData;
    mapper = new ObjectMapper();
  }

  @GetMapping("/stations")
  public ObjectNode getMapStations() {
    logger.info("Got Request for Stations in Map.");
    ObjectNode stations = mapper.createObjectNode();

    for (EVehicleType type : EVehicleType.values()) {
      this.lineData.getData().stream()
          .filter(l -> l.getType() == type)
          .map(Line::getStopsInbound)
          .flatMap(Collection::stream)
          .forEach(s -> putStop(stations, s, type));
    }
    return stations;
  }

  private void putStop(ObjectNode stations, Stop s, EVehicleType lineType) {
    ObjectNode stop = stations.putObject(s.getCommonName());
    stop.put("title", s.getCommonName());
    stop.put("type", lineType.toString());
    ObjectNode position = stop.putObject("position");
    position.put("lat", s.getLatitude());
    position.put("lon", s.getLongitude());
  }

  @GetMapping("/lines")
  public ObjectNode getMapLines() {
    logger.info("Got Request for Lines in Map.");
    ObjectNode lines = mapper.createObjectNode();
    List<Line> lineData = this.lineData.getData();
    for (Line l : lineData) {
      ObjectNode line = lines.putObject(l.getName());
      line.put("id", l.getId());
      line.put("color", l.getHexColor());
      line.put("type", l.getType().toString());
    }
    return lines;
  }

  @GetMapping("/connections")
  public ObjectNode getMapConnections() {
    logger.info("Got Request for Connections in Map.");
    ObjectNode connections = mapper.createObjectNode();
    List<Line> lineData = this.lineData.getData();
    for (Line l : lineData) {
      ArrayNode line = connections.putArray(l.getName());
      List<Stop> stops = l.getStopsInbound();
      for (int i = 0; i < stops.size(); i++) {
        ObjectNode connection = line.addObject();
        connection.put("station", stops.get(i).getCommonName());
        connection.put("number", i);
      }
    }
    return connections;
  }

  @GetMapping("/state")
  @Cacheable("networkState")
  public EState getMapState() {
    logger.info("Got Request to return overall Network state");
    Double vehicleSeverity = vehicleData.getData().stream().mapToInt(Vehicle::getSeverity).average().getAsDouble();
    Double stopSeverity = stopData.getData().stream().mapToInt(Stop::getSeverity).average().getAsDouble();
    return StateCalculator.getState((int) ((vehicleSeverity + stopSeverity) / 2));
  }
}
