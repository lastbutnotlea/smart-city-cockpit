package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.config.AppConfiguration.TIMEZONE;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.config.C4CConfig;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.c4c.AppointmentInvolvedParties;
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
public class EventControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testEventController() throws Exception {
    ControllerTestHelper<Event> eventControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        AppConfiguration.API_PREFIX + "/events",
        new TypeReference<List<Event>>() {
        });
    List<AppointmentInvolvedParties> aip = new ArrayList<AppointmentInvolvedParties>() {{
      add(new AppointmentInvolvedParties(
          (String) C4CConfig.PARTY_NAME_TO_ID.keySet().toArray()[0]));
    }};
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("There are gonna be many many people", EC4CNotesTypeCode.APPOINTMENT_NOTES));
    }};
    Event event = new Event("Fussballspiel", EState.FINE,
        LocalDateTime.now(TIMEZONE), LocalDateTime.now(
        TIMEZONE).plusHours(1),
        "Uni Augsburg Gruppe 02 / Universitätsstraße 02 / 86159 Augsburg / DE", aip, notes);
    eventControllerTestHelper.testAddAndDelete(event);
  }


}
