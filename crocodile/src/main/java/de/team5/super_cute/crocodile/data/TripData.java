package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  @Autowired
  public TripData(HibernateTemplate template) {
    super(Trip.class, template);
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  @Override
  public List<Trip> getData() {
    List<Trip> list = super.getData();
    for (Trip t : list) {
      getHibernateTemplate().initialize(t.getLine().getStopsInbound());
      getHibernateTemplate().initialize(t.getLine().getStopsOutbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeInbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeOutbound());
    }
    return list;
  }

  public Set<String> skipStopsInTimeFrameForAllTrips(String stopId, LocalDateTime from,
      LocalDateTime to) {
    Set<String> skippedStopTripIds = new HashSet<>();
    for(Trip t : getData()) {
      boolean skippedStop = skipStopInTimeFrame(t, stopId, from, to);
      if (skippedStop) {
        skippedStopTripIds.add(t.getId());
      }
    }
    return skippedStopTripIds;
  }

  public void unskipStop(Set<String> tripIds, String stopId) {
    tripIds.stream()
        .map(this::getObjectForId)
        .peek(trip -> trip.getStops().put(stopId, null))
        .peek(this::insertCorrectTimesForTrip)
        .forEach(this::editObject);
  }

  /**
   * @param trip in which to skip
   * @param stopId of the stop to skip
   * @param from start of the skip time frame
   * @param to end of the skip time frame
   * @return true when a stop was skipped within the given trip
   */
  private boolean skipStopInTimeFrame(Trip trip, String stopId, LocalDateTime from,
      LocalDateTime to) {
    LocalDateTime stopTime = trip.getStops().get(stopId);
    if (stopTime != null && stopTime.isAfter(from) && stopTime.isBefore(to)) {
      trip.getStops().remove(stopId);
      editObject(trip);
      return true;
    }
    return false;
  }

  public List<Trip> getActiveTrips() {
    LocalDateTime now = LocalDateTime.now();
    return getData().stream()
        .filter(t -> t.getStops().values().stream()
            .min(LocalDateTime::compareTo).orElse(now.plusDays(1))
            .isBefore(now))
        .filter(t -> t.getStops().values().stream()
            .max(LocalDateTime::compareTo).orElse(now.minusDays(1))
            .isAfter(now)).collect(Collectors.toList());
  }

  public List<Trip> getActiveTripsWithDelay(LocalDateTime time) {
    return getData().stream()
        .filter(t -> t.getStops().values().stream()
            .min(LocalDateTime::compareTo)
            .orElse(time.plusDays(1)).withSecond(0).withNano(0)
            .isBefore(time.minusSeconds(t.getVehicle().getDelay())))
        .filter(t -> t.getStops().values().stream()
            .max(LocalDateTime::compareTo)
            .orElse(time.minusDays(1)).withSecond(0).withNano(1)
            .isAfter(time.minusSeconds(t.getVehicle().getDelay())))
        .collect(Collectors.toList());
  }

  public Trip getCurrentTripOfVehicle(Vehicle vehicle, LocalDateTime time) {
    return getActiveTripsWithDelay(time).stream()
        .filter(t -> t.getVehicle().equals(vehicle)).findAny().orElse(null);
  }

  public boolean hasPresentOrFutureTrips(String vehicleId) {
    return getData().stream().anyMatch(
        t -> t.getVehicle().getId().equals(vehicleId) && t.getStops().values().stream()
            .max(LocalDateTime::compareTo).orElse(null).isAfter(LocalDateTime.now()));
  }

  public List<Trip> getAllTripsOfVehicle(String vehicleId) {
    return getData().stream().filter(t -> t.getVehicle().getId().equals(vehicleId))
        .collect(Collectors.toList());
  }

  private Optional<LocalDateTime> getLastStopTimeOfVehicle(Vehicle vehicle) {
    return getAllTripsOfVehicle(vehicle.getId()).stream()
        .flatMap(t -> t.getStops().values().stream()).max(LocalDateTime::compareTo);
  }

  public void setFreeFrom(Vehicle vehicle) {
    Optional<LocalDateTime> lastStopTime = getLastStopTimeOfVehicle(vehicle);
    if (lastStopTime.isPresent()) {
      vehicle.setFreeFrom(lastStopTime.get());
    } else {
      vehicle.setFreeFrom(null);
    }
  }

  /**
   * Sets the correct times for each stop that has the dummy time associated. At least one Stop has
   * to have a useful time!
   *
   * @param tripInput Trip with some dummy values, these are replaced with correct ones
   */
  public void insertCorrectTimesForTrip(Trip tripInput) {
    // Filter out Stops with dummy value + find stop in the trip with a specified time
    String firstStopIdOfTrip = tripInput.getStops().entrySet().stream()
        .filter(e -> e.getValue() != null)
        .map(Entry::getKey).findAny()
        .orElseThrow(() -> new IllegalArgumentException(
            "No Stop in trip that has something else than null"));
    LocalDateTime departureAtFirstStopOfTrip = tripInput.getStops().get(firstStopIdOfTrip);

    // Find offset from first stop to line start
    Map<String, Integer> travelTime =
        tripInput.getIsInbound() ?
            tripInput.getLine().getTravelTimeInbound()
            : tripInput.getLine().getTravelTimeOutbound();

    int tripToLineOffset = travelTime.get(firstStopIdOfTrip);
    List<String> stopIdsThatNeedCorrectTime = tripInput.getStops().entrySet().stream()
        .filter(e -> e.getValue() == null)
        .map(Entry::getKey)
        .collect(Collectors.toList());

    for (String stopId : stopIdsThatNeedCorrectTime) {
      int travelTimeFromStartToStop = travelTime.get(stopId);
      LocalDateTime correctTime = departureAtFirstStopOfTrip.minusMinutes(tripToLineOffset)
          .plusMinutes(travelTimeFromStartToStop);
      tripInput.getStops().put(stopId, correctTime);
    }
  }
}
