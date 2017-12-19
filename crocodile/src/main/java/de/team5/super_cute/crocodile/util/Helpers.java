package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.util.ArrayList;
import java.util.List;

public class Helpers {

  public static final List<Line> lines_test = new TpDataConnector().getLines(new ArrayList<String>() {{
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

}
