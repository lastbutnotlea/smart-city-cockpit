package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.config.C4CConfig;
import de.team5.super_cute.crocodile.external.C4CProperty;
import java.util.Map.Entry;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class AppointmentInvolvedParties extends C4CEntity {

  @C4CProperty(name = "PartyId")
  @JsonIgnore
  private String partyId = "";

  @C4CProperty(name = "PartyName")
  private String partyName;

  @C4CProperty(name = "RoleCode", maxLength = 10)
  @JsonIgnore
  private String roleCode = "35"; // Organisator

  @C4CProperty(name = "PartyTypeCode", maxLength = 15)
  @JsonIgnore
  private String partyTypeCode = "167"; // Termin

  public AppointmentInvolvedParties() {
  }

  public AppointmentInvolvedParties(String partyName) {
    this.partyName = partyName;
  }

  public String getPartyId() {
    return partyId;
  }

  public void setPartyId(String partyId) {
    this.partyId = partyId;
  }

  public String getPartyName() {
    return C4CConfig.PARTY_NAME_TO_ID.entrySet().stream()
        .filter(e -> e.getValue().equals(this.partyId)).map(
            Entry::getKey).findAny().orElse(this.partyName);
  }

  public void setPartyName(String partyName) {
    this.partyName = partyName;
    this.partyId = C4CConfig.PARTY_NAME_TO_ID.get(partyName);
  }

  public String getRoleCode() {
    return roleCode;
  }

  public void setRoleCode(String roleCode) {
    this.roleCode = roleCode;
  }

  public String getPartyTypeCode() {
    return partyTypeCode;
  }

  public void setPartyTypeCode(String partyTypeCode) {
    this.partyTypeCode = partyTypeCode;
  }

  @Override
  public String getCollectionName() {
    return "AppointmentInvolvedPartiesCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new AppointmentInvolvedParties();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof AppointmentInvolvedParties)) {
      return false;
    }

    AppointmentInvolvedParties that = (AppointmentInvolvedParties) o;

    return new EqualsBuilder()
        .appendSuper(super.equals(o))
        .append(getPartyId(), that.getPartyId())
        .append(getPartyName(), that.getPartyName())
        .append(getRoleCode(), that.getRoleCode())
        .append(getPartyTypeCode(), that.getPartyTypeCode())
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .appendSuper(super.hashCode())
        .append(getPartyId())
        .append(getPartyName())
        .append(getRoleCode())
        .append(getPartyTypeCode())
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("partyId", partyId)
        .append("partyName", partyName)
        .append("roleCode", roleCode)
        .append("partyTypeCode", partyTypeCode)
        .toString();
  }
}

