package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehicles")
public class VehicleController extends BaseController<Vehicle> {

  private Logger logger = LoggerFactory.getLogger(this.getClass());

  private TripData tripData;

  @Autowired
  public VehicleController(BaseData<Vehicle> vehicleData, TripData tripData) {
    data = vehicleData;
    this.tripData = tripData;
  }

  @GetMapping
  public List<Vehicle> getAllVehicles() {
    logger.info("Got Request to return all vehicles");
    return data.getData();
  }

  @GetMapping("/{id}")
  public Vehicle getVehicle(@PathVariable String id) {
    logger.info("Got Request to return the vehicle with id " + id);
    return getObjectForId(id);
  }

  @PostMapping
  public String addVehicle(@RequestBody Vehicle input) {
    logger.info("Got Request to add the vehicle " + input);
    return addObject(input);
  }

  @DeleteMapping("/{id}")
  public String deleteVehicle(@PathVariable String id) {
    logger.info("Got Request to delete the vehicle with id " + id);
    if (tripData.getPresentAndFutureTripsForVehicle(id)) {
      //there are planned or active trips for that vehicle
      return "Vehicle is in use!";
    }
    //delete past trips for this vehicle
    List<Trip> trips = tripData.getData().stream().filter(t -> t.getVehicle().getId().equals(id))
        .collect(Collectors.toList());
    for (Trip trip:trips) {
      tripData.deleteObject(trip.getId());
    }
    return deleteObject(id);
  }

  @DeleteMapping("/{id}/force")
  public String forceDeleteVehicle(@PathVariable String id) {
    logger.info("Got Request to delete the vehicle with id " + id);
    //delete trips for this vehicle
    List<Trip> trips = tripData.getData().stream().filter(t -> t.getVehicle().getId().equals(id))
        .collect(Collectors.toList());
    for (Trip trip:trips) {
      tripData.deleteObject(trip.getId());
    }
    return deleteObject(id);
  }

  @PutMapping
  public String editVehicle(@RequestBody Vehicle input) {
    logger.info("Got Request to edit a vehicle to " + input);
    return editObject(input);
  }
}
