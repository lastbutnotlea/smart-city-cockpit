package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
  public LineController(BaseData<Line> lineData) {
    data = lineData;
  }

  @Autowired
  private TripData tripData;

  @GetMapping
  public List<Line> getAllLines() {
    return data.getData();
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    return getObjectForId(id);
  }

  @GetMapping("/filter-data")
  public FilterData getFilterData() {
    FilterData fd = new FilterData();
    fd.lineNames = data.getData().stream().map(Line::getName).collect(Collectors.toList());
    fd.types = Arrays.stream(EVehicleType.values()).map(EVehicleType::toString)
        .collect(Collectors.toList());
    return fd;
  }

  @GetMapping("/{id}/vehicles/inbound")
  public PositionData getVehiclePositionInbound(@PathVariable String id) {
    return getVehiclePosition(id, true);
  }

  @GetMapping("/{id}/vehicles/outbound")
  public PositionData getVehiclePositionOutbound(@PathVariable String id) {
    return getVehiclePosition(id, false);
  }

  private PositionData getVehiclePosition(String id, boolean isInbound) {
    Line line = getObjectForId(id);
    if (line == null) {
      return null;
    }
    List<PositionAtStopData> positionAtStopDatas = new ArrayList<>();
    List<PositionAfterStopData> positionAfterStopDatas = new ArrayList<>();
    List<Trip> trips = tripData.getActiveTripsWithDelay().stream()
        .filter(t -> t.isInbound() == isInbound)
        .filter(t -> t.getLine().getId().equals(line.getId())).collect(Collectors.toList());
    LocalDateTime now = LocalDateTime.now();
    for (Trip trip : trips) {
      addPositionForTrip(trip, now, positionAtStopDatas, positionAfterStopDatas);
    }
    PositionData positionData = new PositionData();
    positionData.positionsAtStops = positionAtStopDatas;
    positionData.positionAfterStops = positionAfterStopDatas;
    return positionData;
  }

  private void addPositionForTrip(Trip trip, LocalDateTime now,
      List<PositionAtStopData> positionAtStopDatas,
      List<PositionAfterStopData> positionAfterStopDatas) {
    Vehicle vehicle = trip.getVehicle();
    //check if the vehicle is at a stop at current minute
    LocalDateTime timeAtStop = trip.getStops().values().stream().filter(
        l -> l.getDayOfYear() == now.minusMinutes(vehicle.getDelay()).getDayOfYear()
            && l.getHour() == now.minusMinutes(vehicle.getDelay()).getHour()
            && l.getMinute() == now.minusMinutes(vehicle.getDelay()).getMinute()).findAny()
        .orElse(null);
    if (timeAtStop != null) {
      //if the vehicle is at a stop at current minute
      addPositionAtStop(trip, timeAtStop, positionAtStopDatas);
    } else {
      //else take last stop
      addPositionAfterStop(trip, positionAfterStopDatas, now);
    }
  }

  private void addPositionAtStop(Trip trip, LocalDateTime timeAtStop,
      List<PositionAtStopData> positionAtStopDatas) {
    //check if positionDataAtStop exists for this stop
    PositionAtStopData positionAtStopData = positionAtStopDatas.stream().filter(
        p -> p.stopid == trip.getStops().entrySet().stream()
            .filter(e -> e.getValue().isEqual(timeAtStop)).findAny().orElse(null).getKey())
        .findAny().orElse(null);
    if (positionAtStopData == null) {
      positionAtStopData = new PositionAtStopData();
      positionAtStopData.stopid = trip.getStops().entrySet().stream()
          .filter(e -> e.getValue().isEqual(timeAtStop)).findAny().orElse(null).getKey();
      positionAtStopData.vehicleIds = new ArrayList<>();
      positionAtStopDatas.add(positionAtStopData);
    }
    positionAtStopData.vehicleIds.add(trip.getVehicle().getId());
  }

  private void addPositionAfterStop(Trip trip, List<PositionAfterStopData> positionAfterStopDatas,
      LocalDateTime now) {
    LocalDateTime timeAtLastStop = trip.getStops().values().stream().sorted()
        .filter(l -> l.isBefore(now.minusMinutes(trip.getVehicle().getDelay()))).findFirst()
        .orElse(null);
    if (timeAtLastStop == null) {
      //error. but should not happen
    }
    //check if positionDataAfterStop exists for last stop
    PositionAfterStopData positionAfterStopData = positionAfterStopDatas.stream().filter(
        p -> p.lastStopid == trip.getStops().entrySet().stream()
            .filter(e -> e.getValue().isEqual(timeAtLastStop)).findAny().orElse(null).getKey())
        .findAny().orElse(null);
    if (positionAfterStopData == null) {
      positionAfterStopData = new PositionAfterStopData();
      positionAfterStopData.lastStopid = trip.getStops().entrySet().stream()
          .filter(e -> e.getValue().isEqual(timeAtLastStop)).findAny().orElse(null).getKey();
      positionAfterStopData.vehicleIds = new ArrayList<>();
      positionAfterStopDatas.add(positionAfterStopData);
    }
    positionAfterStopData.vehicleIds.add(trip.getVehicle().getId());
  }

  private class FilterData {

    @JsonProperty
    List<String> lineNames;
    @JsonProperty
    List<String> types;
  }

  private class PositionAtStopData {

    @JsonProperty
    String stopid;
    @JsonProperty
    List<String> vehicleIds;
  }

  private class PositionAfterStopData {

    @JsonProperty
    String lastStopid;
    @JsonProperty
    List<String> vehicleIds;
  }

  private class PositionData {

    @JsonProperty
    List<PositionAtStopData> positionsAtStops;
    @JsonProperty
    List<PositionAfterStopData> positionAfterStops;
  }
}
