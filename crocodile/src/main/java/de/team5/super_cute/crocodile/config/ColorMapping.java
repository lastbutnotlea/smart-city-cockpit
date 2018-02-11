package de.team5.super_cute.crocodile.config;

import java.awt.Color;
import java.util.HashMap;
import java.util.Map;

public class ColorMapping {

  public static final Map<String, Color> LINE_COLORS = new HashMap<String, Color>() {{
    put("10", new Color(0, 149, 152, 255));
    put("283", new Color(182, 83, 208, 255));
    put("46", new Color(28, 97, 38, 255));
    put("228", new Color(63, 26, 245, 255));
    put("7", new Color(157, 6, 0, 255));
    put("Bakerloo", new Color(224, 225, 0, 255));
    put("Hammersmith & City", new Color(0, 217, 255, 255));
    put("Jubilee", new Color(255, 124, 118, 255));
    put("Victoria", new Color(226, 136, 255, 255));
    put("Waterloo & City", new Color(116, 255, 135, 255));
  }};

  public static final Map<String, Color> GIRLY_COLORS = new HashMap<String, Color>() {{
    put("10", new Color(204, 0, 204, 255));
    put("283", new Color(255, 102, 153, 255));
    put("46", new Color(153, 51, 255, 255));
    put("228", new Color(184, 46, 138, 255));
    put("7", new Color(153, 255, 255, 255));
    put("Bakerloo", new Color(102, 153, 255, 255));
    put("Hammersmith & City", new Color(255, 153, 255, 255));
    put("Jubilee", new Color(255, 0, 170, 255));
    put("Victoria", new Color(128, 0, 255, 255));
    put("Waterloo & City", new Color(204, 153, 255, 255));
  }};


}
