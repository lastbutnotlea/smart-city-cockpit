package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;

public class VehiclePositionData {

  @JsonProperty
  public String id;
  @JsonProperty
  public EVehicleType type;
  @JsonProperty
  public EState state;

}
