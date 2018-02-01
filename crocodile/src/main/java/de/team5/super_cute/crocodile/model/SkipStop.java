package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;
import org.apache.commons.lang3.builder.ToStringBuilder;

@Entity
@Table(name = "skipstop")
public class SkipStop extends IdentifiableObject implements Serializable{

  @Column(name = "skip_from")
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime from;

  @Column(name = "skip_to")
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime to;

  @Column
  private String reason;

  private String stopId;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> skippedTripIds;

  public LocalDateTime getFrom() {
    return from;
  }

  public void setFrom(LocalDateTime from) {
    this.from = from;
  }

  public LocalDateTime getTo() {
    return to;
  }

  public void setTo(LocalDateTime to) {
    this.to = to;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

  public String getStopId() {
    return stopId;
  }

  public void setStopId(String stopId) {
    this.stopId = stopId;
  }

  public Set<String> getSkippedTripIds() {
    return skippedTripIds;
  }

  public void setSkippedTripIds(Set<String> skippedTripIds) {
    this.skippedTripIds = skippedTripIds;
  }

  public void addSkippedTripId(String tripId) {
    skippedTripIds.add(tripId);
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("from", from)
        .append("to", to)
        .append("reason", reason)
        .append("stopId", stopId)
        .append("skippedTripIds", skippedTripIds)
        .toString();
  }
}
