package de.team5.super_cute.crocodile.model.c4c;

public enum EC4CNotesTypeCode {
  APPOINTMENT_NOTES("10002"),
  SERVICE_REQUEST_DESCRIPTION("10004");

  private final String code;
  EC4CNotesTypeCode(String code) { this.code=code; }
  public String toString() { return code; }
}
