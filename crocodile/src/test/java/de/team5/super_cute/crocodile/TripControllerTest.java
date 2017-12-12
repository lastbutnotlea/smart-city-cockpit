package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class TripControllerTest extends BaseControllerTest<Trip> {

  @Autowired
  private MockMvc mockMvc;

  @Before
  public void setup() {
    baseMockMvc = mockMvc;
  }

  @Test
  public void testTripController() throws Exception {
    Trip testTrip = new Trip(new Vehicle(25, 13, 2, new ArrayList<String>(), EVehicleType.Bus), new Line(), null);
    testController("/trips", testTrip, new TypeReference<List<Trip>>() {});
  }

}

