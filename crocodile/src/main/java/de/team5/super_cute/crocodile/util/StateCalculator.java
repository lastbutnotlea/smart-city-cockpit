package de.team5.super_cute.crocodile.util;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.SEVERITY_LIMIT_CRITICAL;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.SEVERITY_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.model.EState.CRITICAL;
import static de.team5.super_cute.crocodile.model.EState.FINE;
import static de.team5.super_cute.crocodile.model.EState.PROBLEMATIC;

import de.team5.super_cute.crocodile.model.EState;

public class StateCalculator {

  public static EState getState(int severitySum) {
    if (severitySum < SEVERITY_LIMIT_PROBLEMATIC) {
      return FINE;
    } else if (severitySum < SEVERITY_LIMIT_CRITICAL) {
      return PROBLEMATIC;
    } else {
      return CRITICAL;
    }
  }
}
