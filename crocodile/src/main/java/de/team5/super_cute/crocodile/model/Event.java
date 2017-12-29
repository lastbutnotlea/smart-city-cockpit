package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.external.C4CProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class Event extends C4CEntity {

  // TODO: true wird nicht akzeptiert bzw von C4C auf false gesetzt,
  // vllt weil wir keinen Zeitpunkt mit angeben?
  // → wenn wir entscheiden welche properties wir hier wirklich brauchen sollten wir das rauskriegen
  @C4CProperty(name = "AllDayEvent")
  public boolean allDayEvent;

  @C4CProperty(name = "Subject")
  public String subject;

  public Event() {
  }

  public Event(boolean allDayEvent, String subject) {
    this.allDayEvent = allDayEvent;
    this.subject = subject;
  }

  public Event(String id, boolean allDayEvent, String subject) {
    this.id = id;
    this.allDayEvent = allDayEvent;
    this.subject = subject;
  }


  @Override
  public String getCollectionName() {
    return "AppointmentCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new Event();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("allDayEvent", allDayEvent)
        .append("subject", subject)
        .append("id", id)
        .append("objectId", objectId)
        .toString();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Event that = (Event) o;

    return new EqualsBuilder()
        .append(id.toLowerCase(), that.id.toLowerCase())
        .append(allDayEvent, that.allDayEvent)
        .append(subject.toLowerCase(), that.subject.toLowerCase())
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(id.toLowerCase())
        .append(allDayEvent)
        .append(subject.toLowerCase())
        .toHashCode();
  }
}
