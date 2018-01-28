package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_ENGINE_FAILURE;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class VehicleControllerTest {

  @Autowired
  private MockMvc mockMvc;

  public VehicleControllerTest() {
  }

  @Test
  public void testVehicleController() throws Exception {
    ControllerTestHelper<Vehicle> vehicleControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/vehicles",
        new TypeReference<List<Vehicle>>() {
        });
    Vehicle testVehicle = new Vehicle(300, 100, 0, 28, EVehicleType.SUBWAY, VEHICLE_ENGINE_FAILURE);
    vehicleControllerTestHelper.testAddAndDelete(testVehicle);
  }

}
