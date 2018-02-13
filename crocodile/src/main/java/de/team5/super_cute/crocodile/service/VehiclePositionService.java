package de.team5.super_cute.crocodile.service;

import static de.team5.super_cute.crocodile.config.AppConfiguration.TIMEZONE;

import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.jsonclasses.PositionData;
import de.team5.super_cute.crocodile.jsonclasses.PositionStopData;
import de.team5.super_cute.crocodile.jsonclasses.VehiclePositionData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehiclePositionService {

  private TripData tripData;

  @Autowired
  public VehiclePositionService(TripData tripData) {
    this.tripData = tripData;
  }

  public PositionData getVehiclePositions(Line line, boolean isInbound) {
    if (line == null) {
      return null;
    }
    List<PositionStopData> positionAtStopDatas = new ArrayList<>();
    addAllPositionStopDatas(positionAtStopDatas, line, isInbound);
    List<PositionStopData> positionAfterStopDatas = new ArrayList<>();
    addAllPositionStopDatas(positionAfterStopDatas, line, isInbound);

    LocalDateTime now = LocalDateTime.now(TIMEZONE);
    List<Trip> trips = tripData.getActiveTripsWithDelay(now).stream()
        .filter(t -> t.getIsInbound() == isInbound)
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

  private void addAllPositionStopDatas(List<PositionStopData> positionStopDatas, Line line,
      boolean isInbound) {
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
    Entry<String, Boolean> currentStop = getStopForGivenTime(vehicle, trip, now);
    if (currentStop.getValue()) {
      addPositionAtStop(trip, positionAtStopDatas, currentStop.getKey());
    } else {
      addPositionAtStop(trip, positionAfterStopDatas, currentStop.getKey());
    }
  }

  /**
   * @return if (value) { stopId the vehicle is at at the given time }
   * else ( stopId the vehicle was last before the given time }
   */
  public Entry<String, Boolean> getStopForGivenTime(Vehicle vehicle, Trip trip,
      LocalDateTime time) {
    LocalDateTime vehicleTime = time.minusSeconds(vehicle.getDelay());
    LocalDateTime timeAtStop = trip.getStops().values().stream()
        .filter(l -> l.getDayOfYear() == vehicleTime.getDayOfYear()
            && l.getHour() == vehicleTime.getHour()
            && l.getMinute() == vehicleTime.getMinute())
        .findAny()
        .orElse(null);
    boolean isAtStop = true;
    if (timeAtStop == null) {
      LocalDateTime timeAtLastStop = trip.getStops().values().stream()
          .filter(l -> l.isBefore(time.minusSeconds(trip.getVehicle().getDelay())))
          .sorted((l, l0) -> l0.compareTo(l))
          .findFirst()
          .orElse(null);
      isAtStop = false;
      if (timeAtLastStop == null) {
        // vehicle not currently on trip
        return null;
      } else {
        timeAtStop = timeAtLastStop;
      }
    }
    LocalDateTime finalTimeAtStop = timeAtStop;
    String stopId = trip.getStops().entrySet().stream().filter(e -> e.getValue().withSecond(0).withNano(0).equals(
        finalTimeAtStop.withSecond(0).withNano(0)))
        .map(Entry::getKey).findAny().orElse(null);

    boolean finalIsAtStop = isAtStop;

    return new Entry<String, Boolean>() {
      @Override
      public String getKey() {
        return stopId;
      }

      @Override
      public Boolean getValue() {
        return finalIsAtStop;
      }

      @Override
      public Boolean setValue(Boolean value) {
        throw new UnsupportedOperationException();
      }
    };
  }

  private void addPositionAtStop(Trip trip, List<PositionStopData> positionStopDatas,
      String stopId) {
    positionStopDatas.stream()
        .filter(p -> p.stopId.equals(stopId))
        .findAny()
        .ifPresent(psd -> psd.vehiclePositionData.add(generateVehiclePositionData(trip)));
  }

  private VehiclePositionData generateVehiclePositionData(Trip trip) {
    VehiclePositionData vpd = new VehiclePositionData();
    vpd.id = trip.getVehicle().getId();
    vpd.type = trip.getVehicle().getType();
    vpd.state = trip.getVehicle().getState();
    return vpd;
  }


}
