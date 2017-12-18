package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehicles")
public class VehicleController extends BaseController<Vehicle> {

  @Autowired
  public VehicleController(BaseData<Vehicle> vehicleData) {
    data = vehicleData;
  }

  @GetMapping
  public List<Vehicle> getAllVehicles() {
    return data.getData();
  }
}
