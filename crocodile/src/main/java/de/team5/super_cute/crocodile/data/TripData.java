package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  private LocalDateTimeAttributeConverter localDateTimeAttributeConverter;
  private String activeTripsWithDelayQuery = "with trip_times(trip_id, min, max) as (\n"
      + "  select trip.id, min(t.stops), max(t.stops)\n"
      + "  from trip join trip_stops t on trip.id = t.trip_id\n"
      + "  group by trip.id\n"
      + ")\n"
      + "\n"
      + "select trip.*\n"
      + "from trip_times join trip on trip_times.trip_id = trip.id\n"
      + "  join vehicle v on trip.vehicle_id = v.id\n"
      + "where max > localtimestamp - v.delay * interval '1 second'\n";
  private String presentTripsWithDelayQueryAdditive = " and min < localtimestamp - v.delay * interval '1 second'";

  @Autowired
  public TripData(HibernateTemplate template) {
    super(Trip.class, template);
    localDateTimeAttributeConverter = new LocalDateTimeAttributeConverter();
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
    for (Trip t : getData()) {
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
    return (List<Trip>) getCurrentSession()
        .createSQLQuery("with trip_times(trip_id, min, max) as (\n"
            + "  select trip.id, min(t.stops), max(t.stops)\n"
            + "  from trip join trip_stops t on trip.id = t.trip_id\n"
            + "  group by trip.id\n"
            + ")\n"
            + "\n"
            + "select trip.*\n"
            + "from trip_times join trip on trip_times.trip_id = trip.id\n"
            + "where min < localtimestamp and max > localtimestamp").addEntity(Trip.class).list();
  }

  public List<Trip> getActiveTripsForLine(String lineId) {
    return (List<Trip>) getCurrentSession().createSQLQuery(
        activeTripsWithDelayQuery + presentTripsWithDelayQueryAdditive + " and where line_id = '"
            + lineId + "'").addEntity(Trip.class).list();
  }

  public List<Trip> getActiveTripsWithDelay() {
    return (List<Trip>) getCurrentSession()
        .createSQLQuery(activeTripsWithDelayQuery + presentTripsWithDelayQueryAdditive)
        .addEntity(Trip.class).list();
  }

  public Trip getCurrentTripOfVehicle(Vehicle vehicle, LocalDateTime time) {
    return (Trip) getCurrentSession().createSQLQuery(
        activeTripsWithDelayQuery + presentTripsWithDelayQueryAdditive + " and v.id = '" + vehicle
            .getId() + "'").addEntity(Trip.class).uniqueResult();
  }

  public boolean hasPresentOrFutureTrips(String vehicleId) {
    return
        getCurrentSession().createSQLQuery(activeTripsWithDelayQuery + " and v.id = " + vehicleId)
            .addEntity(Trip.class).list().size() > 0;
  }

  public List<Trip> getAllTripsOfVehicle(String vehicleId) {
    return (List<Trip>) getCurrentSession()
        .createQuery("from Trip where vehicle_id = '" + vehicleId + "'").list();
  }

  public List<Trip> getAllTripsOfStop(String stopId) {
    return (List<Trip>) getCurrentSession().createSQLQuery("select trip.*\n"
        + "from trip join trip_stops t on trip.id = t.trip_id\n"
        + "where t.stop_id = '" + stopId + "'").addEntity(Trip.class).list();
  }

  private LocalDateTime getLastStopTimeOfVehicle(Vehicle vehicle) {
    return (LocalDateTime) getCurrentSession().createQuery(
        "select max(stops) from trip join trip_stops on trip.id = trip_stops.trip_id where vehicle_id = '"
            + vehicle.getId() + "'").uniqueResult();
  }

  public void setFreeFrom(Vehicle vehicle) {
    vehicle.setFreeFrom(getLastStopTimeOfVehicle(vehicle));
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
