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
    for (Line LINE : LINES) {
      assertEquals("Error in line " + LINE.getName()
              + " TravelTimeInbound and StopsInbound not equals",
          LINE.getTravelTimeInbound().size(), LINE.getStopsInbound().size());
      assertEquals("Error in line " + LINE.getName()
              + " TravelTimeOutbound and StopsOutbound not equals",
          LINE.getTravelTimeOutbound().size(), LINE.getStopsOutbound().size());
      for (int x = 0; x < LINE.getStopsInbound().size(); x++) {
        assertNotNull("Error in line " + LINE.getName()
                + " TravelTimeInbound for specific stop not found",
            LINE.getTravelTimeInbound().get(LINE.getStopsInbound().get(x).getId()));
      }
      for (int x = 0; x < LINE.getStopsOutbound().size(); x++) {
        assertNotNull("Error in line " + LINE.getName()
                + " TravelTimeOutbound for specific stop not found",
            LINE.getTravelTimeOutbound()
                .get(LINE.getStopsOutbound().get(x).getId()));
      }
    }
    assert (0 == LINES.get(0).getTravelTimeInbound().get("490014553J"));
    assert (1 == LINES.get(0).getTravelTimeInbound().get("490001171H"));
    assert (6 == LINES.get(0).getTravelTimeInbound().get("490009498W"));
  }
}
