package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.util.Helpers.lines_test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;

public class TpDataConnectorTests {

  @Test
  public void testGetlines_test() {

    assertEquals("10 lines_test expected", 10, lines_test.size());
    for (int i = 0; i < lines_test.size(); i++) {
      assertEquals("Error in line " + lines_test.get(i).getName()
              + " TravelTimeInbound and StopsInbound not equals",
          lines_test.get(i).getTravelTimeInbound().size(), lines_test.get(i).getStopsInbound().size());
      assertEquals("Error in line " + lines_test.get(i).getName()
              + " TravelTimeOutbound and StopsOutbound not equals",
          lines_test.get(i).getTravelTimeOutbound().size(), lines_test.get(i).getStopsOutbound().size());
      for (int x = 0; x < lines_test.get(i).getStopsInbound().size(); x++) {
        assertNotNull("Error in line " + lines_test.get(i).getName()
                + " TravelTimeInbound for specific stop not found",
            lines_test.get(i).getTravelTimeInbound().get(lines_test.get(i).getStopsInbound().get(x).getId()));
      }
      for (int x = 0; x < lines_test.get(i).getStopsOutbound().size(); x++) {
        assertNotNull("Error in line " + lines_test.get(i).getName()
                + " TravelTimeOutbound for specific stop not found",
            lines_test.get(i).getTravelTimeOutbound()
                .get(lines_test.get(i).getStopsOutbound().get(x).getId()));
      }
    }
    assert (0 == lines_test.get(0).getTravelTimeInbound().get("490014553J"));
    assert (1 == lines_test.get(0).getTravelTimeInbound().get("490001171H"));
    assert (6 == lines_test.get(0).getTravelTimeInbound().get("490009498W"));
  }
}
