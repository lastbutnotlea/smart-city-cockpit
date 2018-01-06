package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.external.C4CProperty;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

@MappedSuperclass
public abstract class IdentifiableObject {

  private static final Map<Class<? extends IdentifiableObject>, Integer> CURRENT_NUMBER = new HashMap<>();

  @Id
  @Column
  @C4CProperty(name = "ID")
  private String id = null;

  IdentifiableObject() {
    // create id
    StringBuilder builder = new StringBuilder();

    // add classname
    builder.append(this.getClass().getSimpleName());
    builder.append("_");

    // add number
    Integer number = CURRENT_NUMBER.get(this.getClass());
    if (number == null) {
      number = 0;
    }
    CURRENT_NUMBER.put(this.getClass(), number + 1);
    builder.append(number);

    id = builder.toString();
  }

  public final String getId() {
    return id;
  }

  public void setId(String id){
    this.id = id;
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

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("id", id)
        .toString();
  }
}
