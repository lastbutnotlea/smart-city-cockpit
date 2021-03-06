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
  @JsonIgnore
  public String getCollectionName() {
    if (typeCode.equals(EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION.toString())) {
      return "ServiceRequestDescriptionCollection";
    } else if (typeCode.equals(EC4CNotesTypeCode.APPOINTMENT_NOTES.toString())) {
      return "AppointmentNotesCollection";
    } else {
      return "No C4C Collection for this Type Code known.";
    }
  }

  @Override
  @JsonIgnore
  public C4CEntity getEmptyObject() {
    return new C4CNotes();
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getTypeCode() {
    return typeCode;
  }

  public void setTypeCode(String typeCode) {
    this.typeCode = typeCode;
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
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(text)
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("text", text)
        .toString();
  }
}
