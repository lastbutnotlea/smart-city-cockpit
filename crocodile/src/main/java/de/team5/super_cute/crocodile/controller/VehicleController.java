package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.List;
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

  @Autowired
  public VehicleController(BaseData<Vehicle> vehicleData) {
    data = vehicleData;
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
    return deleteObject(id);
  }

  @PutMapping
  public String editVehicle(@RequestBody Vehicle input) {
    logger.info("Got Request to edit a vehicle to " + input);
    return editObject(input);
  }

}
