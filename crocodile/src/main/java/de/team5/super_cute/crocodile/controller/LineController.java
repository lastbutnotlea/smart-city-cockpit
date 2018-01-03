package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController extends BaseController<Line> {

  private Logger logger = LoggerFactory.getLogger(this.getClass());

  private TripData tripData;

  @Autowired
  public LineController(BaseData<Line> lineData, TripData tripData) {
    data = lineData;
    this.tripData = tripData;
  }

  @GetMapping
  public List<Line> getAllLines() {
    logger.info("Got request for all lines");
    return data.getData().stream().peek(l -> l.setState(((LineData) data).calculateLineState(l)))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    logger.info("Got request for line with id " + id);
    Line line = getObjectForId(id);
    line.setState(((LineData) data).calculateLineState(line));
    return line;
  }

  @GetMapping("/filter-data")
  public FilterData getFilterData() {
    logger.info("Got request for filter data");
    FilterData fd = new FilterData();
    fd.lineNames = data.getData().stream().map(Line::getName).collect(Collectors.toList());
    fd.types = Arrays.stream(EVehicleType.values()).map(EVehicleType::toString)
        .collect(Collectors.toList());
    return fd;
  }

  @GetMapping("/{id}/vehicles/inbound")
  public PositionData getVehiclePositionInbound(@PathVariable String id) {
    logger.info("Got request for vehicles inbound of line with id " + id);
    return getVehiclePosition(id, true);
  }

  @GetMapping("/{id}/vehicles/outbound")
  public PositionData getVehiclePositionOutbound(@PathVariable String id) {
    logger.info("Got request for vehicles outbound of line with id " + id);
    return getVehiclePosition(id, false);
  }

  private PositionData getVehiclePosition(String id, boolean isInbound) {
    Line line = getObjectForId(id);
    if (line == null) {
      return null;
    }
    List<PositionStopData> positionAtStopDatas = new ArrayList<>();
    addAllPositionStopDatas(positionAtStopDatas, line, isInbound);
    List<PositionStopData> positionAfterStopDatas = new ArrayList<>();
    addAllPositionStopDatas(positionAfterStopDatas, line, isInbound);

    LocalDateTime now = LocalDateTime.now();
    List<Trip> trips = tripData.getActiveTripsWithDelay(now).stream()
        .filter(t -> t.isInbound() == isInbound)
        .filter(t -> t.getLine().getId().equals(line.getId()))
        .collect(Collectors.toList());

    for (Trip trip : trips) {
      addPositionForTrip(trip, now, positionAtStopDatas, positionAfterStopDatas);
    }

    PositionData positionData = new PositionData();
    positionData.positionAtStops = positionAtStopDatas;
    positionData.positionAfterStops = positionAfterStopDatas;
    return positionData;
  }

  private void addAllPositionStopDatas(List<PositionStopData> positionStopDatas, Line line, boolean isInbound) {
    List<Stop> stops = isInbound ? line.getStopsInbound() : line.getStopsOutbound();
    for (Stop s : stops) {
      PositionStopData positionStopData = new PositionStopData();
      positionStopData.stopId = s.getId();
      positionStopData.stopName = s.getCommonName();
      positionStopData.stopState = s.getState();
      positionStopData.vehiclePositionData = new ArrayList<>();
      positionStopDatas.add(positionStopData);
    }
  }

  private void addPositionForTrip(Trip trip, LocalDateTime now,
      List<PositionStopData> positionAtStopDatas,
      List<PositionStopData> positionAfterStopDatas) {
    Vehicle vehicle = trip.getVehicle();
    //check if the vehicle is at a stop at current minute
    LocalDateTime vehicleTime = now.minusMinutes(vehicle.getDelay());
    LocalDateTime timeAtStop = trip.getStops().values().stream()
        .filter( l -> l.getDayOfYear() == vehicleTime.getDayOfYear()
            && l.getHour() == vehicleTime.getHour()
            && l.getMinute() == vehicleTime.getMinute())
        .findAny()
        .orElse(null);
    if (timeAtStop != null) {
      //if the vehicle is at a stop at current minute
      addPositionAtStop(trip, positionAtStopDatas, timeAtStop);
    } else {
      //else take last stop
      addPositionAfterStop(trip, positionAfterStopDatas, now);
    }
  }

  private void addPositionAfterStop(Trip trip, List<PositionStopData> positionStopDatas,
      LocalDateTime now) {
    LocalDateTime timeAtLastStop = trip.getStops().values().stream()
        .filter(l -> l.isBefore(now.minusMinutes(trip.getVehicle().getDelay())))
        .sorted((l, l0) -> l0.compareTo(l))
        .findFirst()
        .orElse(null);
    if (timeAtLastStop == null) {
      throw new IllegalArgumentException("Time for determining Vehicle Positions between stops was too small");
    }
    addPositionAtStop(trip, positionStopDatas,  timeAtLastStop);
  }

  private void addPositionAtStop(Trip trip, List<PositionStopData> positionStopDatas, LocalDateTime stopTime) {
    positionStopDatas.stream()
        .filter(p -> p.stopId.equals(trip.getStops().entrySet().stream()
            .filter(e -> e.getValue().withSecond(0).withNano(0).isEqual(stopTime.withSecond(0).withNano(0)))
            .map(Entry::getKey)
            .findAny()
            .orElse("")))
        .findAny()
        .ifPresent(psd ->   psd.vehiclePositionData.add(generateVehiclePositionData(trip)));
  }

  private VehiclePositionData generateVehiclePositionData(Trip trip) {
    VehiclePositionData vpd = new VehiclePositionData();
    vpd.id = trip.getVehicle().getId();
    vpd.type = trip.getVehicle().getType();
    vpd.state = trip.getVehicle().getState();
    return vpd;
  }

  private class FilterData {

    @JsonProperty
    List<String> lineNames;
    @JsonProperty
    List<String> types;
  }

  private class PositionStopData {

    @JsonProperty
    String stopId;
    @JsonProperty
    String stopName;
    @JsonProperty
    EState stopState;
    @JsonProperty
    List<VehiclePositionData> vehiclePositionData;
  }

  private class VehiclePositionData {

    @JsonProperty
    String id;
    @JsonProperty
    EVehicleType type;
    @JsonProperty
    EState state;
  }

  private class PositionData {

    @JsonProperty
    List<PositionStopData> positionAtStops;
    @JsonProperty
    List<PositionStopData> positionAfterStops;
  }
}
