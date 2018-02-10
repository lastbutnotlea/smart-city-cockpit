package de.team5.super_cute.crocodile.jsonclasses;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class FilterData {

  @JsonProperty
  public List<String> lineNames;
  @JsonProperty
  public List<String> types;
  @JsonProperty
  public List<String> states;
}
