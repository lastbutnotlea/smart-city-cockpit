package de.team5.super_cute.crocodile.config;

import java.util.ArrayList;

public class InitialSetupConfig {
  public static final int fromHour = 0;
  public static final int fromMinute = 0;
  public static final int toHour = 23;
  public static final int toMinute = 59;

  public static final ArrayList<String> lineIds = new ArrayList<String>() {{
    add("10");
    add("283");
    add("46");
    add("228");
    add("7");
    add("bakerloo");
    add("hammersmith-city");
    add("jubilee");
    add("victoria");
    add("waterloo-city");
  }};
}
