package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_BENCH_BROKEN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DIRTY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_ESCALATOR_NOT_WORKING;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_SHELTER_BROKEN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_ENGINE_FAILURE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_WINDOW_BROKEN;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.Helpers;
import de.team5.super_cute.crocodile.util.LineBuilder;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import java.awt.Color;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class TripControllerTest {

  private Stop s1, s2, s3, s4;
  private Vehicle v1, v2;
  private Line l1, l2;
  private LocalDateTime ldt1;
  private ControllerTestHelper<Trip> tripControllerTestHelper;
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

  public TripControllerTest() {
  }

  private void initTestObjects() {
    s1 = new Stop("ApiId1", "Marienplatz", 10, 3.5, 50, STOP_DIRTY);
    s2 = new Stop("ApiId2", "Odeonsplatz", 11, 3.7, 43, STOP_BENCH_BROKEN);
    s3 = new Stop("ApiId3", "Stachus", 10.2, 2, 61, STOP_SHELTER_BROKEN);
    s4 = new Stop("ApiId4", "Sendlinger Tor", 12.2, 3, 41, STOP_ESCALATOR_NOT_WORKING);
    v1 = new Vehicle(300, 100, 0, 28, EVehicleType.SUBWAY, VEHICLE_ENGINE_FAILURE);
    v2 = new Vehicle(340, 50, 2, 31, EVehicleType.SUBWAY, VEHICLE_WINDOW_BROKEN);
    l1 = new LineBuilder().name("U6").color(Color.blue).stops(s2, s1, s4).travelTime(0, 2, 5).type(EVehicleType.SUBWAY).build();
    l2 = new LineBuilder().name("S1").color(Color.cyan).stops(s3, s1).travelTime(0, 3).type(EVehicleType.SUBWAY).build();
    ldt1 = LocalDateTime.of(2017, Month.AUGUST, 12, 11, 30);
    new NetworkDataBuilder(lineData, vehicleData, stopData, tripData)
        .addStops(s1, s2, s3, s4)
        .addLines(l1, l2)
        .addVehicles(v1, v2)
        .build();

    tripControllerTestHelper = new ControllerTestHelper<>(mockMvc, AppConfiguration.API_PREFIX + "/trips",
        new TypeReference<List<Trip>>() {
        });
  }

  @Test
  public void testTripController() throws Exception {
    initTestObjects();
    Trip testTrip = NetworkDataBuilder.assembleWholeLineTrip(v1, l1, ldt1, true);
    tripControllerTestHelper.testAddAndDelete(testTrip);
  }

  @Test
  public void testTripAdding() throws Exception {
    initTestObjects();
    Map<String, LocalDateTime> stops = new HashMap<>();
    stops.put(s2.getId(), Helpers.DUMMY_TIME);
    stops.put(s1.getId(), ldt1);
    stops.put(s4.getId(), Helpers.DUMMY_TIME);
    Trip testTrip = new Trip(v2, l1, stops, true);
    tripControllerTestHelper.testAdd(testTrip);
    Trip tripAfterAdding = tripControllerTestHelper.getObjects().stream()
        .filter(t -> t.getId().equals(testTrip.getId())).findAny().orElse(null);
    assert(tripAfterAdding != null);
    int diffMinutesS1ToS4 = testTrip.getLine().getTravelTimeInbound().get(s4.getId()) - testTrip.getLine().getTravelTimeInbound().get(s1.getId());
    LocalDateTime correctTimeS4 = ldt1.plusMinutes(diffMinutesS1ToS4);
    assert(tripAfterAdding.getStops().get(s4.getId()).equals(correctTimeS4));
    int diffMinutesS1ToS2 = testTrip.getLine().getTravelTimeInbound().get(s2.getId()) - testTrip.getLine().getTravelTimeInbound().get(s1.getId());
    LocalDateTime correctTimeS2 = ldt1.plusMinutes(diffMinutesS1ToS2);
    assert(tripAfterAdding.getStops().get(s2.getId()).equals(correctTimeS2));
  }

}

