package de.team5.super_cute.crocodile.model;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class IdentifiableObject {

  private static final Map<Class<? extends IdentifiableObject>, Integer> currentNumber = new HashMap<>();
  private String id = null;

  IdentifiableObject() {
    // generate Id
    getId();
  }

  //
//  public void setId(String id) {
//    this.id = id;
//  }
//
//  //@JsonProperty("id")}
  public String getId() {
    if (id != null) {
      return id;
    }

    StringBuilder builder = new StringBuilder();

    // add classname
    builder.append(this.getClass().getSimpleName());
    builder.append("_");

    // add number
    Integer number = currentNumber.get(this.getClass());
    if (number == null) {
      number = 0;
    }
    currentNumber.put(this.getClass(), number + 1);
    builder.append(number);

    id = builder.toString();
    return id;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof IdentifiableObject)) {
      return false;
    }

    IdentifiableObject that = (IdentifiableObject) o;

    return new EqualsBuilder()
        .append(getId(), that.getId())
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(getId())
        .toHashCode();
  }
}
