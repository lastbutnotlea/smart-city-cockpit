package de.team5.super_cute.crocodile.model.c4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class C4CNotes extends C4CEntity {

  @C4CProperty(name = "Text")
  private String text;

  /**
   * 10002 for Appointment Notes
   * 10004 for Service Request Description
   */
  @C4CProperty(name = "TypeCode", maxLength = 5)
  @JsonIgnore
  private String typeCode;

  public C4CNotes() {
  }

  public C4CNotes(String text, EC4CNotesTypeCode typeCode) {
    this.text = text;
    this.typeCode = typeCode.toString();
  }

  @Override
  public String getCollectionName() {
    return "AppointmentNotesCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new C4CNotes();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof C4CNotes)) {
      return false;
    }

    C4CNotes c4CNotes = (C4CNotes) o;

    return new EqualsBuilder()
        .append(text, c4CNotes.text)
        .append(typeCode, c4CNotes.typeCode)
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(text)
        .append(typeCode)
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("text", text)
        .append("typeCode", typeCode)
        .toString();
  }
}
