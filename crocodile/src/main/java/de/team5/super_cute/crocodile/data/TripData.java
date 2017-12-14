package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Trip;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  public TripData() {
    super(Trip.class);
  }

}
