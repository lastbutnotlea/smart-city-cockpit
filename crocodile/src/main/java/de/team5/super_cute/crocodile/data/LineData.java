package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class LineData extends BaseData<Line> {

  private TripData tripData;

  @Autowired
  public LineData(HibernateTemplate template, TripData tripData) {
    super(Line.class, template);
    this.tripData = tripData;
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  @Override
  public List<Line> getData() {
    List<Line> list = super.getData();
    for (Line l : list) {
      getHibernateTemplate().initialize(l.getStopsInbound());
      getHibernateTemplate().initialize(l.getStopsOutbound());
      getHibernateTemplate().initialize(l.getTravelTimeInbound());
      getHibernateTemplate().initialize(l.getTravelTimeOutbound());
    }
    return list;
  }

  public boolean exists(String lineName) {
    return super.getData().stream().anyMatch(l -> l.getName().equals(lineName));
  }

  public List<Line> getLineWithStop(String stopid, boolean inbound) {
    return (List<Line>) getCurrentSession().createSQLQuery("select line.*\n"
        + "from line join line_stops_"+ (inbound ? "inb" : "outb") + " stops on line.id = stops.line_id\n"
        + "where stops.stop_id = '"+stopid+"'").addEntity(Line.class).list();
  }

  @Cacheable("lineState")
  public EState calculateLineState(Line line) {
    List<Trip> trips = tripData.getActiveTrips().stream()
            .filter(t -> t.getLine().getId().equals(line.getId()))
            .collect(Collectors.toList());
    int severityVehicles = 0;
    int severityStops = 0;
    int divisorVehicles = 0;
    int divisorStops = 0;
    for (Trip trip : trips) {
      if (trip.getVehicle() != null) {
        severityVehicles += trip.getVehicle().getSeverity();
        divisorVehicles++;
      }
    }
    for (Stop stop : line.getStopsInbound()) {
      severityStops += stop.getSeverity();
      divisorStops++;
    }
    for (Stop stop : line.getStopsOutbound()) {
      severityStops += stop.getSeverity();
      divisorStops++;
    }
    return StateCalculator
            .getState(((divisorVehicles != 0 ? (severityVehicles / divisorVehicles) : (severityStops / divisorStops)) + (severityStops / divisorStops)) / 2);
  }
}
