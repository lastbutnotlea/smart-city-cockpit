package de.team5.super_cute.crocodile;

import com.fasterxml.jackson.core.type.TypeReference;
import de.team5.super_cute.crocodile.model.Line;
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
public class LineControllerTest extends BaseControllerTest<Line> {

  @Autowired
  private MockMvc mockMvc;

  @Before
  public void setup() {
    baseMockMvc = mockMvc;
  }

  @Test
  public void testLineController() throws Exception {
    assert(!getObjects("/lines", new TypeReference<List<Line>>() {}).isEmpty());
  }

}
