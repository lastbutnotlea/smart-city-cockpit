package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.Helpers;
import de.team5.super_cute.crocodile.validation.VehicleValidation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/trips")
public class TripController extends BaseController<Trip> {

  private static final Logger logger = LoggerFactory.getLogger(TripController.class);

  private LineData lineData;
  private VehicleValidation vehicleValidation;

  @Autowired
  public TripController(BaseData<Trip> tripData, LineData lineData,
      VehicleValidation vehicleValidation) {
    data = tripData;
    this.lineData = lineData;
    this.vehicleValidation = vehicleValidation;
  }

  @GetMapping
  public List<Trip> getAllTrips() {
    logger.info("Got Request to return all trips");
    return getTripsWithPredicate(t -> true);
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<Trip> getAllTripsForVehicle(@PathVariable String vehicleId) {
    logger.info("Got Request to return all trips for vehicle with id " + vehicleId);
    return getTripsWithPredicate(t -> StringUtils.isEmpty(vehicleId) || t.getVehicle().getId().equals(vehicleId));
  }

  @GetMapping("/stop/{stopId}")
  public List<Trip> getAllTripsForStop(@PathVariable String stopId) {
    logger.info("Got Request to return all trips for stop with id " + stopId);
    return getTripsWithPredicate(t -> StringUtils.isEmpty(stopId) || t.getStops().get(stopId) != null);
  }

  private List<Trip> getTripsWithPredicate(Predicate<Trip> predicate) {
    return data.getData().stream()
        .filter(predicate)
        .peek(this::prepareTripForFrontend)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Trip getTrip(@PathVariable String id) {
    logger.info("Got Request to return trip with id " + id);
    Trip trip = getObjectForId(id);
    prepareTripForFrontend(trip);
    return trip;
  }

  private void prepareTripForFrontend(Trip trip) {
    trip.getLine().setState(lineData.calculateLineState(trip.getLine()));
    trip.initializeTrip();
  }

  @PostMapping
  public String addTrip(@RequestBody Trip tripInput) {
    logger.info("Got Request to add trip " + tripInput);
    insertCorrectTimesForTrip(tripInput);
    if (tripInput.getVehicle() != null) {
      if (!vehicleValidation.checkVehicleAvailability(tripInput)) {
        return "Vehicle not available!";
      }
    }
    tripInput.initializeTrip();
    return Helpers.makeIdToJSON(addObject(tripInput));
  }

  @DeleteMapping("/{id}")
  public String deleteTrip(@PathVariable String id) {
    logger.info("Got Request to delete trip with id " + id);
    return Helpers.makeIdToJSON(deleteObject(id));
  }

  @PutMapping
  public String editTrip(@RequestBody Trip tripInput) {
    logger.info("Got Request to edit trip " + tripInput);
    insertCorrectTimesForTrip(tripInput);
    if (tripInput.getVehicle() != null) {
      if (!vehicleValidation.checkVehicleAvailability(tripInput)) {
        return "Vehicle not available!";
      }
    }
    tripInput.initializeTrip();
    return Helpers.makeIdToJSON(editObject(tripInput));
  }

  /**
   * Sets the correct times for each stop that has the dummy time associated. At least one Stop has
   * to have a useful time!
   *
   * @param tripInput Trip with some dummy values, these are replaced with correct ones
   */
  private void insertCorrectTimesForTrip(Trip tripInput) {
    // Filter out Stops with dummy value + find stop in the trip with a specified time
    String firstStopIdOfTrip = tripInput.getStops().entrySet().stream()
        .filter(e -> e.getValue() != null)
        //.filter(e -> !e.getValue().equals(Helpers.DUMMY_TIME))
        .map(Entry::getKey).findAny()
        .orElseThrow(() -> new IllegalArgumentException(
            "No Stop in trip that has something else than a dummy time"));
    LocalDateTime departureAtFirstStopOfTrip = tripInput.getStops().get(firstStopIdOfTrip);

    // Find offset from first stop to line start
    Map<String, Integer> travelTime =
        tripInput.getIsInbound() ? tripInput.getLine().getTravelTimeInbound()
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
