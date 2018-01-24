package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "skipstop")
public class SkipStop extends IdentifiableObject{

  @Column(name = "skip_from")
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime from;

  @Column(name = "skip_to")
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime to;

  @Column
  private String reason;

  private String stopId;

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
}
