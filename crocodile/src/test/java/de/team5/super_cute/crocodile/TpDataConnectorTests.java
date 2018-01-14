package de.team5.super_cute.crocodile;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;

public class TpDataConnectorTests {

  public static final List<Line> LINES = getLines();

  private static boolean hasLines = false;
  private static List<Line> lines;
  private static List<Line> getLines() {
    if (!hasLines) {
      lines = new TpDataConnector().getLines(new ArrayList<String>() {{
        add("10");
        add("novalidid");
        add("283");
        add("46");
        add("228");
        add("7");
        add("bakerloo");
        add("hammersmith-city");
        add("jubilee");
        add("victoria");
        add("waterloo-city");
      }});
      hasLines = true;
    }
    return lines;
  }

  @Test
  public void testGetlines_test() {

    assertEquals("10 LINES expected", 10, LINES.size());
    for (int i = 0; i < LINES.size(); i++) {
      assertEquals("Error in line " + LINES.get(i).getName()
              + " TravelTimeInbound and StopsInbound not equals",
          LINES.get(i).getTravelTimeInbound().size(), LINES.get(i).getStopsInbound().size());
      assertEquals("Error in line " + LINES.get(i).getName()
              + " TravelTimeOutbound and StopsOutbound not equals",
          LINES.get(i).getTravelTimeOutbound().size(), LINES.get(i).getStopsOutbound().size());
      for (int x = 0; x < LINES.get(i).getStopsInbound().size(); x++) {
        assertNotNull("Error in line " + LINES.get(i).getName()
                + " TravelTimeInbound for specific stop not found",
            LINES.get(i).getTravelTimeInbound().get(LINES.get(i).getStopsInbound().get(x).getId()));
      }
      for (int x = 0; x < LINES.get(i).getStopsOutbound().size(); x++) {
        assertNotNull("Error in line " + LINES.get(i).getName()
                + " TravelTimeOutbound for specific stop not found",
            LINES.get(i).getTravelTimeOutbound()
                .get(LINES.get(i).getStopsOutbound().get(x).getId()));
      }
    }
    assert (0 == LINES.get(0).getTravelTimeInbound().get("490014553J"));
    assert (1 == LINES.get(0).getTravelTimeInbound().get("490001171H"));
    assert (6 == LINES.get(0).getTravelTimeInbound().get("490009498W"));
  }
}
