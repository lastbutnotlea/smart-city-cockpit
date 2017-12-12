package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Stop;

public class StopData extends BaseData<Stop> {

  public StopData() {
    super(Stop.class);
    addObject(new Stop());
  }

}
