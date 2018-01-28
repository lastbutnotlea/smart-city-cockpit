package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.model.Announcement;
import de.team5.super_cute.crocodile.model.Stop;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class AnnouncementControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testAnnouncementController() throws Exception {
    ControllerTestHelper<Announcement> announcementControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        API_PREFIX + "/announcemnt",
        new TypeReference<List<Announcement>>() {});
    ControllerTestHelper<Stop> stopControllerTestHelper = new ControllerTestHelper<>(mockMvc,
        API_PREFIX + "/stops",
        new TypeReference<List<Stop>>() {});
    List<Stop> stops = stopControllerTestHelper.getObjects().subList(0, 10);
    Announcement announcement = new Announcement("TestTestTest", LocalDateTime.now(), LocalDateTime.now().plusDays(1), stops);
    announcementControllerTestHelper.testAddAndDelete(announcement);
  }
}
