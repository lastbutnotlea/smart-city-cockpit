package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Stop;
import org.springframework.stereotype.Service;

@Service
public class StopData extends BaseData<Stop> {

  public StopData() {
    super(Stop.class);
    //addObject(new Stop("TestStation", 10.0, 20.0, 5));
  }

}
