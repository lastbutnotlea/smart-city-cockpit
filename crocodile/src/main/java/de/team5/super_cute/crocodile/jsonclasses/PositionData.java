package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PositionData {

  @JsonProperty
  public List<PositionStopData> positionAtStops;
  @JsonProperty
  public List<PositionStopData> positionAfterStops;

}
