package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
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
import java.util.HashSet;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class TripControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private LineData lineData;

  @Autowired
  private VehicleData vehicleData;

  @Autowired
  private StopData stopData;

  @Autowired
  private TripData tripData;


  @Test
  public void testTripController() throws Exception {
    Stop s1 = new Stop("ApiId1", "Marienplatz", 10, 3.5, 50, new HashSet<>());
    Stop s2 = new Stop("ApiId2", "Odeonsplatz", 11, 3.7, 43, new HashSet<>());
    Stop s3 = new Stop("ApiId3", "Stachus", 10.2, 2, 61, new HashSet<>());
    Vehicle v1 = new Vehicle(300, 0, 28, EVehicleType.Subway, "Motorschaden");
    Vehicle v2 = new Vehicle(340, 2, 31, EVehicleType.Train, "Fenster gebrochen");
    Line l1 = new LineBuilder().name("U6").color(Color.blue).stops(s2, s1).travelTime(0, 2).build();
    Line l2 = new LineBuilder().name("S1").color(Color.cyan).stops(s3, s1).travelTime(0, 3).build();

    new NetworkDataBuilder(lineData, vehicleData, stopData, tripData)
        .addStops(s1, s2, s3)
        .addLines(l1, l2)
        .addVehicles(v1, v2)
        .build();

    ControllerTestHelper<Trip> tripControllerTestHelper = new ControllerTestHelper<>(mockMvc);
    Trip testTrip = NetworkDataBuilder.assembleWholeLineTrip(v1, l1,
        LocalDateTime.of(2017, Month.AUGUST, 12, 11, 30),
        true);
    tripControllerTestHelper.testAddAndDelete("/trips", testTrip, new TypeReference<List<Trip>>() {
    });
  }

}

