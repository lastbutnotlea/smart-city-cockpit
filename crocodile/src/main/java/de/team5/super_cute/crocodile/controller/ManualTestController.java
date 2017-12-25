package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.LineBuilder;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import java.awt.Color;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
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

  @GetMapping
  public List<Trip> testTrips() {
    Stop s1 = new Stop("ApiId1", "Marienplatz", 10, 3.5, 50);
    Stop s2 = new Stop("ApiId2", "Odeonsplatz", 11, 3.7, 43);
    Stop s3 = new Stop("ApiId3", "Stachus", 10.2, 2, 61);
    Vehicle v1 = new Vehicle(300, 0, 28, EVehicleType.Subway, "Motorschaden");
    Vehicle v2 = new Vehicle(340, 2, 31, EVehicleType.Train, "Fenster gebrochen");
    Line l1 = new LineBuilder().name("U6").color(Color.blue).stops(s2, s1).travelTime(0, 2).build();
    Line l2 = new LineBuilder().name("S1").color(Color.cyan).stops(s3, s1).travelTime(0, 3).build();

    new NetworkDataBuilder(lineData, vehicleData, stopData, tripData)
        .addStops(s1, s2, s3)
        .addLines(l1, l2)
        .addVehicles(v1, v2)
        .build();

    Trip testTrip = NetworkDataBuilder.assembleWholeLineTrip(v1, l1,
        LocalDateTime.of(2017, Month.AUGUST, 12, 11, 30),
        true);
    tripData.addObject(testTrip);
    return tripData.getData();
  }

  @GetMapping("/getData")
  public void initializeData() {
    initialDataGenerator.generateInitialPrototypeSetup();
  }
}
