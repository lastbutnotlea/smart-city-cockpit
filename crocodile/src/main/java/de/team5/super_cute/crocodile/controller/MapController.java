package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/map")
public class MapController {

  List<String> LINES_WE_USE = new ArrayList<String>() {{
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

  private Logger logger = LoggerFactory.getLogger(this.getClass());
  private LineData lineData;
  private StopData stopData;
  private boolean gotDataFromTpConnector = false;
  private ObjectMapper mapper;

  @Autowired
  public MapController(LineData lineData, StopData stopData) {
    this.lineData = lineData;
    this.stopData = stopData;
    mapper = new ObjectMapper();
  }

  @GetMapping("/stations")
  public String getMapStations() throws JsonProcessingException {
    insertLines();

    ObjectNode stations = mapper.createObjectNode();
    List<Stop> stopData = this.stopData.getData();
    for (Stop s : stopData) {
      ObjectNode stop = stations.putObject(s.getCommonName());
      stop.put("title", s.getCommonName());
      ObjectNode position = stop.putObject("position");
      position.put("lat", s.getLatitude());
      position.put("lon", s.getLongitude());
    }
    return mapper.writeValueAsString(stations);
  }

  @GetMapping("/lines")
  public String getMapLines() throws JsonProcessingException {
    insertLines();

    ObjectNode lines = mapper.createObjectNode();
    List<Line> lineData = this.lineData.getData();
    for (Line l : lineData) {
      ObjectNode line = lines.putObject(l.getName());
      line.put("name", l.getName());
      line.put("color", "#" + Integer.toHexString(l.getColor().getRGB()).substring(2));
    }
    return mapper.writeValueAsString(lines);
  }

  @GetMapping("/connections")
  public String getMapConnections() throws JsonProcessingException {
    insertLines();

    ObjectNode connections = mapper.createObjectNode();
    List<Line> lineData = this.lineData.getData();
    for (Line l : lineData) {
      ArrayNode line = connections.putArray(l.getName());
      // TODO replace with consolidated getStops() when it exists
      List<Stop> stops = l.getStopsInbound();
      for (int i = 0; i < stops.size(); i++) {
        ObjectNode connection = line.addObject();
        connection.put("station", stops.get(i).getCommonName());
        connection.put("number", i);
      }
    }
    return mapper.writeValueAsString(connections);
  }

  private void insertLines() {
    /**if (gotDataFromTpConnector) {
     return;
     }
     List<Line> lines = new TpDataConnector().getLines(LINES_WE_USE);
     List<Stop> stops = lines.stream().map(Line::getStopsInbound).flatMap(Collection::stream)
     .collect(
     Collectors.toList());
     stops.addAll(lines.stream().map(Line::getStopsOutbound).flatMap(Collection::stream).collect(
     Collectors.toList()));
     for (Stop s : stops) {
     stopData.addObject(s);
     }
     for (Line l : lines) {
     lineData.addObject(l);
     }
     gotDataFromTpConnector = true;**/
  }

}
