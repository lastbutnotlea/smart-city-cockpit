package de.team5.super_cute.crocodile.config;

import java.util.ArrayList;
import java.util.List;

public class InitialSetupConfig {

  public static final int INITIALIZE_FOR_MINUTES = 30;
  public static final int INITIALIZE_SINCE_MINUTES = 15;

  public static final int PEOPLE_WAITING_INITIAL_MIN = 0;
  public static final int PEOPLE_WAITING_INITIAL_MAX = 400;
  public static final int CAPACITY_INITIAL_MIN = 100;
  public static final int CAPACITY_INITIAL_MAX = 200;
  public static final int DELAY_INITIAL_MIN = -5 * 60;
  public static final int DELAY_INITIAL_MAX = 5 * 60;
  public static final int TEMPERATURE_INITIAL_MIN = 25;
  public static final int TEMPERATURE_INITIAL_MAX = 30;


  public static final List<String> LINEIDS = new ArrayList<String>() {{
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
