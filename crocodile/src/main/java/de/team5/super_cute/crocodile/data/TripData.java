package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  public TripData() {
    super();
    objects.add(new Trip(new Vehicle(10, 0, 30, null, EVehicleType.Bus), new Line(), null));
  }

}
