package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.Helpers;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
  private VehicleData vehicleData;

  @Autowired
  public TripController(BaseData<Trip> tripData, LineData lineData, VehicleData vehicleData) {
    data = tripData;
    this.lineData = lineData;
    this.vehicleData = vehicleData;
  }

  @GetMapping
  public List<Trip> getAllTrips() {
    logger.info("Got Request to return all trips");
    return data.getData().stream()
        .peek(this::prepareTripForFrontend)
        .collect(Collectors.toList());
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<Trip> getAllTripsForVehicle(@PathVariable String vehicleId) {
    logger.info("Got Request to return all trips for vehicle with id " + vehicleId);
    return ((TripData) data).getAllTripsOfVehicle(vehicleId).stream()
        .peek(this::prepareTripForFrontend)
        .collect(Collectors.toList());
  }

  @GetMapping("/stop/{stopId}")
  public List<Trip> getAllTripsForStop(@PathVariable String stopId) {
    logger.info("Got Request to return all trips for stop with id " + stopId);
    return ((TripData) data).getAllTripsOfStop(stopId).stream()
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
    // save new vehicle data from trip initialization to database
    vehicleData.editObject(trip.getVehicle());
  }

  @PostMapping
  public ResponseEntity<String> addTrip(@RequestBody Trip tripInput) {
    logger.info("Got Request to add trip " + tripInput);
    handleTripFromFrontend(tripInput);
    return ResponseEntity.ok(Helpers.makeIdToJSON(addObject(tripInput)));
  }

  @DeleteMapping("/{id}")
  public String deleteTrip(@PathVariable String id) {
    logger.info("Got Request to delete trip with id " + id);
    Trip trip = getObjectForId(id);
    trip.getVehicle().setCurrentTrip(null);
    vehicleData.editObject(trip.getVehicle());
    return Helpers.makeIdToJSON(deleteObject(id));
  }

  @PutMapping
  public String editTrip(@RequestBody Trip tripInput) {
    logger.info("Got Request to edit trip " + tripInput);
    handleTripFromFrontend(tripInput);
    return Helpers.makeIdToJSON(editObject(tripInput));
  }

  private void handleTripFromFrontend(Trip trip) {
    ((TripData) data).insertCorrectTimesForTrip(trip);
    trip.initializeTrip();
    // save new vehicle data from trip initialization to database
    vehicleData.editObject(trip.getVehicle());
  }

}
