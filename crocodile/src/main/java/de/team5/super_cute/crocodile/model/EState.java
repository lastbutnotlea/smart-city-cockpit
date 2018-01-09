package de.team5.super_cute.crocodile.model;

public enum EState {
  FINE,
  PROBLEMATIC,
  CRITICAL;

  public String stateToC4CPriority() {
    switch (this) {
      case FINE:
        return "3"; // immediate
      case PROBLEMATIC:
        return "2"; // urgent
      case CRITICAL:
        return "1"; // normal
        default:
          return "7"; // low priority
    }
  }
}
