package de.team5.super_cute.crocodile;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;

public class TpDataConnectorTests {

  @Test
  public void testGetLines() {
    List<Line> lines = new TpDataConnector().getLines(new ArrayList<String>() {{add("10"); add("novalidid"); add("283"); add("46"); add("228"); add("7"); add("bakerloo"); add("hammersmith-city"); add("jubilee"); add("victoria"); add("waterloo-city");}});
    assertEquals("10 lines expected", 10, lines.size());
    for(int i = 0; i< lines.size(); i++){
      assertEquals("Error in line " + lines.get(i).getName() + " TravelTimeInbound and StopsInbound not equals", lines.get(i).getTravelTimeInbound().size(), lines.get(i).getStopsInbound().size());
      assertEquals("Error in line " + lines.get(i).getName() + " TravelTimeOutbound and StopsOutbound not equals", lines.get(i).getTravelTimeOutbound().size(), lines.get(i).getStopsOutbound().size());
      for(int x = 0; x < lines.get(i).getStopsInbound().size(); x++){
        assertNotNull("Error in line " + lines.get(i).getName() + " TravelTimeInbound for specific stop not found", lines.get(i).getTravelTimeInbound().get(lines.get(i).getStopsInbound().get(x).getId()));
      }
      for(int x = 0; x < lines.get(i).getStopsOutbound().size(); x++){
        assertNotNull("Error in line " + lines.get(i).getName() + " TravelTimeOutbound for specific stop not found", lines.get(i).getTravelTimeOutbound().get(lines.get(i).getStopsOutbound().get(x).getId()));
      }
    }
    assert(0 == lines.get(0).getTravelTimeInbound().get("490014553J"));
    assert(1 == lines.get(0).getTravelTimeInbound().get("490001171H"));
    assert(6 == lines.get(0).getTravelTimeInbound().get("490009498W"));
  }
}
