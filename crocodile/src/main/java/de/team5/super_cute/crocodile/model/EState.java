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

  public static EState c4CPriorityToState(String priority) {
    switch (priority) {
      case "3":
        return FINE;
      case "2":
        return PROBLEMATIC;
      case "1":
        return CRITICAL;
        default:
          return FINE;
    }
  }
}
