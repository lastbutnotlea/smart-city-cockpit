package de.team5.super_cute.crocodile.util;

import static de.team5.super_cute.crocodile.model.EState.CRITICAL;
import static de.team5.super_cute.crocodile.model.EState.FINE;
import static de.team5.super_cute.crocodile.model.EState.PROBLEMATIC;

import de.team5.super_cute.crocodile.model.EState;

public class StateCalculator {

  public static EState getState(int severitySum) {
    if (severitySum <= 5) {
      return FINE;
    } else if (severitySum <= 10) {
      return PROBLEMATIC;
    } else {
      return CRITICAL;
    }
  }
}
