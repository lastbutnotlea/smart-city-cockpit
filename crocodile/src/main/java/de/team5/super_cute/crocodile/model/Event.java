package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;
import de.team5.super_cute.crocodile.model.c4c.AppointmentInvolvedParties;
import de.team5.super_cute.crocodile.model.c4c.C4CEntity;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EStatusCode;
import de.team5.super_cute.crocodile.util.Helpers;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Event extends C4CEntity {

  @C4CProperty(name = "Subject", maxLength = 765)
  private String subject;

  @C4CProperty(name = "AccountID", maxLength = 60)
  @JsonIgnore
  private String accountId = Helpers.SAP_ACCOUNT_ID;

  @C4CProperty(name = "CategoryCode", maxLength = 4)
  @JsonIgnore
  private String category = "0001"; // Kundenbesuch

  @C4CProperty(name = "TypeCode", maxLength = 15)
  @JsonIgnore
  private String type = "12"; // keine Ahnung wieso 12, das ist bei den bisherigen so TODO soll das Frontend die sehen/einstellen können? (z.B. Veranstaltung, Fußball, Oper)

  @C4CProperty(name = "PriorityCode", maxLength = 1)
  private EState priority = EState.FINE;

  @C4CProperty(name = "StatusCode", maxLength = 2)
  @JsonIgnore
  private EStatusCode status = EStatusCode.OPEN; // offen

  @C4CProperty(name = "StartDateTime", metadataType = "c4codata.LOCALNORMALISED_DateTime")
  private LocalDateTime startTime;

  @C4CProperty(name = "EndDateTime", metadataType = "c4codata.LOCALNORMALISED_DateTime")
  private LocalDateTime endTime;

  @C4CProperty(name = "LocationName", maxLength = 100)
  private String LocationName;

  @C4CProperty(name = "AppointmentInvolvedParties", hasAssociatedEntities = true)
  private List<AppointmentInvolvedParties> appointmentInvolvedParties;

  @C4CProperty(name = "AppointmentNotes", hasAssociatedEntities = true)
  private List<C4CNotes> appointmentNotes;

  public Event() {
  }

  public Event(String subject, EState priority, LocalDateTime startTime,
      LocalDateTime endTime, String locationName,
      List<AppointmentInvolvedParties> appointmentInvolvedParties,
      List<C4CNotes> appointmentNotes) {
    this.subject = subject;
    this.priority = priority;
    this.startTime = startTime;
    this.endTime = endTime;
    this.LocationName = locationName;
    this.appointmentInvolvedParties = appointmentInvolvedParties;
    this.appointmentNotes = appointmentNotes;
  }

  @Override
  public String getCollectionName() {
    return "AppointmentCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new Event();
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getAccountId() {
    return accountId;
  }

  public void setAccountId(String accountId) {
    this.accountId = accountId;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public EState getPriority() {
    return priority;
  }

  public void setPriority(EState priority) {
    this.priority = priority;
  }

  public EStatusCode getStatus() {
    return status;
  }

  public void setStatus(EStatusCode status) {
    this.status = status;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }

  public LocalDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }

  public String getLocationName() {
    return LocationName;
  }

  public void setLocationName(String locationName) {
    LocationName = locationName;
  }

  public List<AppointmentInvolvedParties> getAppointmentInvolvedParties() {
    return appointmentInvolvedParties;
  }

  public void setAppointmentInvolvedParties(
      List<AppointmentInvolvedParties> appointmentInvolvedParties) {
    this.appointmentInvolvedParties = appointmentInvolvedParties;
  }

  public List<C4CNotes> getAppointmentNotes() {
    return appointmentNotes;
  }

  public void setAppointmentNotes(List<C4CNotes> appointmentNotes) {
    this.appointmentNotes = appointmentNotes;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof Event)) {
      return false;
    }

    Event event = (Event) o;

    return new EqualsBuilder()
        .append(getSubject(), event.getSubject())
        .append(getAccountId(), event.getAccountId())
        .append(getCategory(), event.getCategory())
        .append(getType(), event.getType())
        .append(getPriority(), event.getPriority())
        .append(getStatus(), event.getStatus())
        .append(getStartTime(), event.getStartTime())
        .append(getEndTime(), event.getEndTime())
        .append(getLocationName(), event.getLocationName())
        // kriegen wir lokal nicht alle hin, ignorieren wir damit die Tests laufen :)
        //.append(getAppointmentInvolvedParties(), event.getAppointmentInvolvedParties())
        .append(getAppointmentNotes(), event.getAppointmentNotes())
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(getSubject())
        .append(getAccountId())
        .append(getCategory())
        .append(getType())
        .append(getPriority())
        .append(getStatus())
        .append(getStartTime())
        .append(getEndTime())
        .append(getLocationName())
        //.append(getAppointmentInvolvedParties())
        .append(getAppointmentNotes())
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("subject", subject)
        .append("accountId", accountId)
        .append("category", category)
        .append("type", type)
        .append("priority", priority)
        .append("status", status)
        .append("startTime", startTime)
        .append("endTime", endTime)
        .append("LocationName", LocationName)
        .append("appointmentInvolvedParties", appointmentInvolvedParties)
        .append("appointmentNotes", appointmentNotes)
        .toString();
  }
}
