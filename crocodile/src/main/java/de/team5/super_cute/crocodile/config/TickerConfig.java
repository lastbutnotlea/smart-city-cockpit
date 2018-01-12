package de.team5.super_cute.crocodile.config;

public class TickerConfig {
  public static final int ITEM_COUNT = 20;
  public static final int TICKER_FREQUENCY = 3 * 60 * 1000;

  public static final int STOP_COUNT = 7;
  public static final int VEHICLE_COUNT = 7;
  public static final int EVENT_COUNT = 20;

  public static final int FEEDBACK_BASE_PRIORITY = 1;
  public static final int FEEDBACK_FINE_PRIORITY = 2;
  public static final int FEEDBACK_PROBLEMATIC_PRIORITY = 4;
  public static final int FEEDBACK_CRITICAl_PRIORITY = 6;

  public static final int STOP_BASE_PRIORITY = 6;
  public static final int VEHICLE_BASE_PRIORITY = 6;
  public static final int EVENT_FINE_PRIORITY = 10;
  public static final int EVENT_PROBLEMATIC_PRIORITY = 15;
  public static final int EVENT_CRITICAL_PRIORITY = 20;
  public static final int SEVERITY_DIVISOR = 4;
}
