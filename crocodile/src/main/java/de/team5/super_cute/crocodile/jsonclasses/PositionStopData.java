package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.model.EState;
import java.util.List;

public class PositionStopData {

  @JsonProperty
  public String stopId;
  @JsonProperty
  public String stopName;
  @JsonProperty
  public EState stopState;
  @JsonProperty
  public List<VehiclePositionData> vehiclePositionData;

}
