package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController extends BaseController<Line> {

  @Autowired
  public LineController(BaseData<Line> lineData, TripData tripData) {
    data = lineData;
    this.tripData = tripData;
  }

  private TripData tripData;

  @GetMapping
  public List<Line> getAllLines() {
    return data.getData().stream().peek(l -> l.setState(calculateLineState(l)))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    Line line = getObjectForId(id);
    line.setState(calculateLineState(line));
    return line;
  }

  public EState calculateLineState(Line line) {
    List<Trip> trips = tripData.getActiveTrips().stream()
        .filter(t -> t.getLine().getId() == line.getId())
        .collect(Collectors.toList());
    int severityVehicles = 0;
    int severityStops = 0;
    int divisorVehicles = 0;
    int divisorStops = 0;
    for (Trip trip : trips) {
      if (trip.getVehicle() != null) {
        severityVehicles += trip.getVehicle().getSeverity();
        divisorVehicles++;
      }
    }
    for (Stop stop : line.getStopsInbound()) {
      severityStops += stop.getSeverity();
      divisorStops++;
    }
    for (Stop stop : line.getStopsOutbound()) {
      severityStops += stop.getSeverity();
      divisorStops++;
    }
    return StateCalculator
        .getState(((severityVehicles / divisorVehicles) + (severityStops / divisorStops)) / 2);
  }

  @GetMapping("/filter-data")
  public FilterData getFilterData() {
    FilterData fd = new FilterData();
    fd.lineNames = data.getData().stream().map(Line::getName).collect(Collectors.toList());
    fd.types = Arrays.stream(EVehicleType.values()).map(EVehicleType::toString)
        .collect(Collectors.toList());
    return fd;
  }

  private class FilterData {

    @JsonProperty
    List<String> lineNames;
    @JsonProperty
    List<String> types;
  }
}
