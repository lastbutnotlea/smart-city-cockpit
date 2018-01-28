package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import java.time.LocalDateTime;
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
public class ServiceRequestControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testServiceRequestController() throws Exception {
    ControllerTestHelper<ServiceRequest> serviceRequestControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/servicerequests",
        new TypeReference<List<ServiceRequest>>() {
        });
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
    }};
    ServiceRequest sr = new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(), EState.FINE, LocalDateTime.now().plusDays(5),
            EServiceType.MAINTENANCE, notes, "Vehicle_0", "Feedback_0");
    serviceRequestControllerTestHelper.testAddAndDelete(sr);
  }

}
