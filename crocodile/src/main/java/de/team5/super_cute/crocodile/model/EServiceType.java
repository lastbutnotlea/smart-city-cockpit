package de.team5.super_cute.crocodile.model;

import java.util.Arrays;

public enum EServiceType {
  CLEANING("ZCLN"),
  MAINTENANCE("SRRQ");

  private final String code;

  EServiceType(String code) {
    this.code = code;
  }

  public static EServiceType getServiceType(String code) {
    return Arrays.stream(EServiceType.values()).filter(v -> v.getCode().equals(code)).findAny()
        .orElseThrow(() -> new IllegalArgumentException("No enum value for this code: " + code));
  }

  public String getCode() {
    return code;
  }
}
