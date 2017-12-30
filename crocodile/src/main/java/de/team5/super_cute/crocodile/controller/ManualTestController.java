package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class ManualTestController {

  @Autowired
  private LineData lineData;

  @Autowired
  private VehicleData vehicleData;

  @Autowired
  private StopData stopData;

  @Autowired
  private TripData tripData;

  @Autowired
  private InitialDataGenerator initialDataGenerator;

  @GetMapping("/getData")
  public void initializeData() {
    initialDataGenerator.generateInitialPrototypeSetup();
  }
}
