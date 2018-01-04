package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LineForStopData {
  @JsonProperty
  boolean isInbound;
  @JsonProperty
  String lineId;

  public LineForStopData(boolean isInbound, String lineId) {
    this.isInbound = isInbound;
    this.lineId = lineId;
  }
}
