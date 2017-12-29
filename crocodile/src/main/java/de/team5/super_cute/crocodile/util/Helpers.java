package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Helpers {

  public static final List<Line> LINES = new TpDataConnector().getLines(new ArrayList<String>() {{
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

  public static LocalDateTime DUMMY_TIME = LocalDateTime.MIN.withYear(0).withHour(0).withMinute(0);

}
