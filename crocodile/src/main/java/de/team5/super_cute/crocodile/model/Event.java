package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;
import java.time.LocalDateTime;
import java.util.List;

public class Event extends C4CEntity {

  @C4CProperty(name = "Subject", maxLength = 765)
  private String subject;

  @C4CProperty(name = "AccountID", maxLength = 60)
  @JsonIgnore
  private String accountId = "4000560"; // wohl unser Account 'Uni Augsburg02'

  @C4CProperty(name = "CategoryCode", maxLength = 4)
  @JsonIgnore
  private String category = "0001"; // Kundenbesuch

  @C4CProperty(name = "TypeCode", maxLength = 15)
  @JsonIgnore
  private String type = "12"; // keine Ahnung wieso 12, das ist bei den bisherigen so TODO soll das Frontend die sehen/einstellen können? (z.B. Veranstaltung, Fußball, Oper)

  @C4CProperty(name = "PriorityCode", maxLength = 1)
  private String priority = "3"; // normal

  @C4CProperty(name = "StatusCode", maxLength = 2)
  @JsonIgnore
  private String status = "1"; // offen

  @C4CProperty(name = "StartDateTime", metadataType = "c4codata.LOCALNORMALISED_DateTime")
  private LocalDateTime startTime;

  @C4CProperty(name = "EndDateTime", metadataType = "c4codata.LOCALNORMALISED_DateTime")
  private LocalDateTime endTime;

  @C4CProperty(name = "LocationName", maxLength = 100)
  private String LocationName;

  @C4CProperty(name = "AppointmentInvolvedParties")
  private List<AppointmentInvolvedParties> appointmentInvolvedParties;

  @C4CProperty(name = "C4CNotes")
  private List<C4CNotes> appointmentNotes;

  public Event() {
  }

  public Event(String subject, String priority, LocalDateTime startTime,
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

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
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
}
