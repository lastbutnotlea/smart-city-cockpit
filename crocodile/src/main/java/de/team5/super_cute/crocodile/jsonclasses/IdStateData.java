package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.model.EState;

public class IdStateData {
  @JsonProperty
  public String id;
  @JsonProperty
  public EState state;

  public IdStateData(String id, EState state) {
    this.id = id;
    this.state = state;
  }
}
