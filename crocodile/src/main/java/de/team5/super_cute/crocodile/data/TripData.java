package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  @Autowired
  public TripData(HibernateTemplate template) {
    super(Trip.class, template);
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  @Override
  public List<Trip> getData() {
    List<Trip> list = super.getData();
    for (Trip t : list) {
      getHibernateTemplate().initialize(t.getLine().getStopsInbound());
      getHibernateTemplate().initialize(t.getLine().getStopsOutbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeInbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeOutbound());
    }
    return list;
  }

  public List<Trip> getActiveTrips() {
    LocalDateTime now = LocalDateTime.now();
    return getData().stream()
        .filter(t -> t.getStops().values().stream()
            .min(LocalDateTime::compareTo).orElse(now.plusDays(1))
            .isBefore(now))
        .filter(t -> t.getStops().values().stream()
            .max(LocalDateTime::compareTo).orElse(now.minusDays(1))
            .isAfter(now)).collect(Collectors.toList());
  }

  public List<Trip> getActiveTripsWithDelay(LocalDateTime time) {
    return getData().stream()
        .filter(t -> t.getStops().values().stream()
            .min(LocalDateTime::compareTo)
            .orElse(time.plusDays(1)).withSecond(0).withNano(0)
            .isBefore(time.minusSeconds(t.getVehicle().getDelay())))
        .filter(t -> t.getStops().values().stream()
            .max(LocalDateTime::compareTo)
            .orElse(time.minusDays(1)).withSecond(0).withNano(1)
            .isAfter(time.minusSeconds(t.getVehicle().getDelay())))
        .collect(Collectors.toList());
  }

  public Trip getCurrentTripOfVehicle(Vehicle vehicle, LocalDateTime time) {
    return getActiveTripsWithDelay(time).stream()
        .filter(t -> t.getVehicle().equals(vehicle)).findAny().orElse(null);
  }

}
