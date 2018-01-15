package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LineForStopData {
  @JsonProperty
  boolean isInbound;
  @JsonProperty
  String line;

  public LineForStopData(boolean isInbound, String line) {
    this.isInbound = isInbound;
    this.line = line;
  }
}
