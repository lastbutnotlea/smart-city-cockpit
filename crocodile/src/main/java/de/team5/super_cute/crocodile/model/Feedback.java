package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.util.FeedbackableAttributeConverter;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "feedback")
public class Feedback extends IdentifiableObject implements Serializable, TickerItemable {

  @Column
  private String message;

  @Column
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime timestamp;

  @Column
  @Convert(converter = FeedbackableAttributeConverter.class)
  private Feedbackable objective;

  @Column
  private EFeedbackType feedbackType;

  @Column
  private EState rating;

  public Feedback() {
    super();
  }

  public Feedback(String message, LocalDateTime timestamp, Feedbackable objective,
      EFeedbackType feedbackType, EState rating) {
    super();
    this.message = message;
    this.timestamp = timestamp;
    this.objective = objective;
    this.feedbackType = feedbackType;
    this.rating = rating;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  @JsonProperty("timestamp")
  public String getTimestamp() {
    return timestamp.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
  }

  @JsonProperty("timestamp")
  public void setTimestamp(String timestamp) {
    this.timestamp = LocalDateTime.parse(timestamp);
  }

  public Feedbackable getObjective() {
    return objective;
  }

  public void setObjective(Feedbackable objective) {
    this.objective = objective;
  }

  public EFeedbackType getFeedbackType() {
    return feedbackType;
  }

  public void setFeedbackType(EFeedbackType feedbackType) {
    this.feedbackType = feedbackType;
  }

  public EState getRating() {
    return rating;
  }

  public void setRating(EState rating) {
    this.rating = rating;
  }
}
