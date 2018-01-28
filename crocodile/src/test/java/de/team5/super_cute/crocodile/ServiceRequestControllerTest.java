package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
public class ServiceRequestControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testServiceRequestController() throws Exception {
    ControllerTestHelper<ServiceRequest> serviceRequestControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/servicerequests",
        new TypeReference<List<ServiceRequest>>() {
        });
    ControllerTestHelper<Feedback> feedbackControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/feedback",
        new TypeReference<List<Feedback>>() {
        });
    ControllerTestHelper<Vehicle> vehicleControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/vehicles",
        new TypeReference<List<Vehicle>>() {
        });
    List<Feedback> feedbacks = feedbackControllerTestHelper.getObjects();
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
    }};
    ServiceRequest sr = new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(), EState.FINE, LocalDateTime.now().plusDays(5),
            EServiceType.MAINTENANCE, notes, "Vehicle_0", "FeedbackGroup_0");
    sr.setTarget(vehicleControllerTestHelper.getObjects().get(0));
    sr.setFeedbacks(new HashSet<Feedback>(feedbacks));
    serviceRequestControllerTestHelper.testAddAndDelete(sr);
  }

}
