package de.team5.super_cute.crocodile;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.junit.Test;

public class TpDataConnectorTests {

  /*@Test
  public void testGetStops() {
    List<Stop> stops = new TpDataConnector().getStops(new ArrayList<String>() {{add("940GZZLUBOS"); add("490G00019898");}});
    assertEquals(2, stops.size());
    assertEquals("940GZZLUBOS", stops.get(0).getApiIp());
    assertEquals("490G00019898", stops.get(1).getApiIp());
    assertEquals("Boston Manor Underground Station", stops.get(0).getCommonName());
    assertEquals("Highbury Grove School / Baalbec Road", stops.get(1).getCommonName());
    stops = new TpDataConnector().getStops(new ArrayList<String>() {{add("novalidstop"); add("490009498W");}});
    assertEquals(1, stops.size());
  }*/

  @Test
  public void testGetLines() {
    List<Line> lines = new TpDataConnector().getLines(new ArrayList<String>() {{add("10"); add("novalidid"); add("283"); add("46"); add("228"); add("7"); add("bakerloo"); add("hammersmith-city"); add("jubilee"); add("victoria"); add("waterloo-city");}});
    assertEquals("10 lines expected", 10, lines.size());
    for(int i = 0; i< lines.size(); i++){
      assertEquals("Error in line " + lines.get(i).getName() + " TravelTimeInbound and StopsInbound not equals", lines.get(i).getTravelTimeInbound().size(), lines.get(i).getStopsInbound().size());
      assertEquals("Error in line " + lines.get(i).getName() + " TravelTimeOutbound and StopsOutbound not equals", lines.get(i).getTravelTimeOutbound().size(), lines.get(i).getStopsOutbound().size());
      for(int x = 0; x < lines.get(i).getStopsInbound().size(); x++){
        assertNotNull("Error in line " + lines.get(i).getName() + " TravelTimeInbound for specific stop not found", lines.get(i).getTravelTimeInbound().get(lines.get(i).getStopsInbound().get(x).getApiIp()));
      }
      for(int x = 0; x < lines.get(i).getStopsOutbound().size(); x++){
        assertNotNull("Error in line " + lines.get(i).getName() + " TravelTimeOutbound for specific stop not found", lines.get(i).getTravelTimeOutbound().get(lines.get(i).getStopsOutbound().get(x).getApiIp()));
      }
    }
    assert(0 == lines.get(0).getTravelTimeInbound().get("490014553J"));
    assert(1 == lines.get(0).getTravelTimeInbound().get("490001171H"));
    assert(6 == lines.get(0).getTravelTimeInbound().get("490009498W"));
  }

 /* @Test
  public void testGetTrip() {
    Calendar c = Calendar.getInstance();
    List<Line> lines = new TpDataConnector().getLines(new ArrayList<String>() {{add("10");}});
    Trip trip = new TpDataConnector().getTrip(lines.get(0), new Vehicle(), new ArrayList<String>() {{add("490014553J"); add("490001171H");add("490000129R");add("490009498W");add("490012867M");}}, c);
    assert(trip != null);
    Calendar cc = (Calendar) c.clone();
    cc.add(Calendar.MINUTE, 1);
    assertEquals(cc.getTime(), trip.getStops().get("490001171H").getTime());
    Calendar ccc = (Calendar) c.clone();
    ccc.add(Calendar.MINUTE, 6);
    assertEquals(ccc.getTime(), trip.getStops().get("490009498W").getTime());
  }*/

}
