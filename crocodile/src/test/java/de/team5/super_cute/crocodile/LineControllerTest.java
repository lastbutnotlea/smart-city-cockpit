package de.team5.super_cute.crocodile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.model.Line;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
@TestPropertySource(properties = "app.scheduling.enable=false")
public class LineControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testLineController() throws Exception {
    mockMvc.perform(get("/test"));
    assert(!(new ControllerTestHelper<Line>(mockMvc, "/lines", new TypeReference<List<Line>>() {})).getObjects().isEmpty());
  }

}
