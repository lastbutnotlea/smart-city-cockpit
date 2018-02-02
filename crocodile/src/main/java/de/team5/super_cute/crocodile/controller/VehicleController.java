package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_INITIAL;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.Helpers;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/vehicles")
public class VehicleController extends BaseController<Vehicle> {

  private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);

  private TripData tripData;
  private LineData lineData;

  @Autowired
  public VehicleController(BaseData<Vehicle> vehicleData, TripData tripData, LineData lineData) {
    data = vehicleData;
    this.tripData = tripData;
    this.lineData = lineData;
  }

  @GetMapping
  public List<Vehicle> getAllVehicles() {
    logger.info("Got Request to return all vehicles");
    return data.getData().stream()
        .filter(v -> !v.getIsShutDown())
        .sorted((v1, v2) -> v1.getId().compareTo(v2.getId()))
        .collect(Collectors.toList());
  }

  @GetMapping("/withcurrenttrip")
  public List<Vehicle> getAllVehiclesWithCurrentTrip() {
    logger.info("Got Request to return all vehicles with current Trips");
    return data.getData().stream()
        .filter(v -> !v.getIsShutDown())
        .peek(this::setCurrentTrip)
        .sorted((v1, v2) -> v1.getId().compareTo(v2.getId()))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Vehicle getVehicle(@PathVariable String id) {
    logger.info("Got Request to return the vehicle with id " + id);
    Vehicle v = getObjectForId(id);
    setCurrentTrip(v);
    return v;
  }

  @PostMapping
  public String addVehicle(@RequestBody Vehicle input) {
    logger.info("Got Request to add the vehicle " + input);
    if (input.getId() == null) {
      input.setId();
    }
    input.setLoad(0);
    input.setTemperature(TEMPERATURE_INITIAL);
    input.setIsShutDown(false);
    return Helpers.makeIdToJSON(addObject(input));
  }

  @DeleteMapping("/{id}")
  public String deleteVehicle(@PathVariable String id) {
    logger.info("Got Request to delete the vehicle with id " + id);
    if (tripData.hasPresentOrFutureTrips(id)) {
      //there are planned or active trips for that vehicle
      return "Vehicle is in use!";
    }
    //delete past trips for this vehicle
    return forceDeleteVehicle(id);
  }

  @DeleteMapping("/{id}/force")
  public String forceDeleteVehicle(@PathVariable String id) {
    logger.info("Got Request to delete the vehicle with id " + id);
    //delete trips for this vehicle
    List<Trip> trips = tripData.getAllTripsOfVehicle(id);
    for (Trip trip: trips) {
      tripData.deleteObject(trip.getId());
    }
    Vehicle v = getObjectForId(id);
    v.setIsShutDown(true);
      return Helpers.makeIdToJSON(deleteObject(id));
  }

  @PutMapping
  public String editVehicle(@RequestBody Vehicle input) {
    logger.info("Got Request to edit a vehicle to " + input);
    return Helpers.makeIdToJSON(editObject(input));
  }

  @GetMapping("/state")
  public EState getOverallVehiclesState() {
    logger.info("Got Request return overall vehicle state");
    return StateCalculator.getState((int) data.getData().stream().mapToInt(Vehicle::getSeverity).average().getAsDouble());
  }

  /**
   * @return all vehicles with the type
   * @param type free for the time
   * @param timeString .
   */
  @GetMapping("/type/{type}/free-from/{timeString}")
  public List<Vehicle> getVehiclesFreeFrom(@PathVariable String type, @PathVariable String timeString, @RequestParam(defaultValue = "")
      String ignoreTripId) {
    logger.info("Got Request to return all Vehicles of Type " + type + " free from " + timeString);
    List<Vehicle> vehicles = data.getData().stream()
        .filter(this::matchVehicleTypeAndFreeFrom)
        .filter(v -> v.getType().equals(EVehicleType.valueOf(type)))
        .peek(tripData::setFreeFrom)
        .filter(v -> !LocalDateTime.parse(timeString).isBefore(v.getFreeFrom()))
        .collect(Collectors.toList());
    if (!ignoreTripId.equals("")) {
      vehicles.add(tripData.getObjectForId(ignoreTripId).getVehicle());
    }
    return vehicles;
  }

  private boolean matchVehicleTypeAndFreeFrom(Vehicle vehicle, EVehicleType type, LocalDateTime freeFrom) {
    if (!vehicle.getType().equals(type)) {
      return false;
    }
    tripData.setFreeFrom(vehicle);
    return vehicle.getFreeFrom().isAfter(freeFrom);
  }

  private void setCurrentTrip(Vehicle vehicle) {
    if (vehicle == null) {
      return;
    }
    if (vehicle.getOutdateCurrentTrip().isBefore(LocalDateTime.now())) {
      Trip current = tripData.getCurrentTripOfVehicle(vehicle, LocalDateTime.now());
      if (current != null) {
        current.getLine().setState(lineData.calculateLineState(current.getLine()));
      }
      vehicle.setCurrentTrip(current);
    }
    if (vehicle.getFreeFrom().equals(Helpers.DUMMY_TIME)) {
      vehicle.setFreeFrom(LocalDateTime.now());
    }
  }
}
