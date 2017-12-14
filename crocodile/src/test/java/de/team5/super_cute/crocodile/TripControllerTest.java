package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import java.awt.Color;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class TripControllerTest{

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private LineData lineData;

  @Autowired
  private VehicleData vehicleData;

  @Autowired
  private StopData stopData;


  @Test
  public void testTripController() throws Exception {
    Stop s1 = new Stop("ApiId1", "Marienplatz", 10, 3.5, 50);
    stopData.addObject(s1);
    Stop s2 = new Stop("ApiId2", "Odeonsplatz", 11, 3.7, 43);
    stopData.addObject(s2);
    Stop s3 = new Stop("ApiId3", "Stachus", 10.2, 2, 61);
    stopData.addObject(s3);

    ArrayList<Stop> l1Inbound = new ArrayList<>();
    l1Inbound.add(s2);
    l1Inbound.add(s1);
    ArrayList<Stop> l1Outbound = new ArrayList<>();
    l1Outbound.add(s1);
    l1Outbound.add(s2);
    Line l1 = new Line("U6", Color.blue, l1Inbound)

    ControllerTestHelper<Trip> tripControllerTestHelper = new ControllerTestHelper<>(mockMvc);
    Trip testTrip = new Trip(vehicle, line, null);
    tripControllerTestHelper.testAddAndDelete("/trips", testTrip, new TypeReference<List<Trip>>() {});
  }

}

