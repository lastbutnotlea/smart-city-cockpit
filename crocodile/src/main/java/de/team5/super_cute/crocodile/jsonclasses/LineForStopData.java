package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LineForStopData {
  @JsonProperty
  boolean isInbound;
  @JsonProperty
  String line;
  /**
   * The id of the respective line.
   */
  @JsonProperty
  String id;

  public LineForStopData(boolean isInbound, String line, String id) {
    this.isInbound = isInbound;
    this.line = line;
    this.id = id;
  }
}
