package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_BASE_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_CRITICAl_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_FINE_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_PROBLEMATIC_PRIORITY;

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

  @Override
  public String getItemDescription() {
    return this.message;
  }

  @Override
  public String getItemHeader() {
    String feedbackType = "";
    switch (this.getFeedbackType()){
      case VEHICLE_FEEDBACK:
        feedbackType = "vehicles";
        break;
      case STOP_FEEDBACK:
        feedbackType = "stops";
        break;
      case LINE_FEEDBACK:
        feedbackType = "lines";
        break;
    }
    return "Customer feedback about one of our " + feedbackType;
  }

  @Override
  public EState getItemState() {
    return this.rating;
  }

  @Override
  public int getItemPriority() {
    int priority = 0;
    switch (this.rating){
      case FINE:
        priority = FEEDBACK_FINE_PRIORITY;
        break;
      case PROBLEMATIC:
        priority = FEEDBACK_PROBLEMATIC_PRIORITY;
        break;
      case CRITICAL:
        priority = FEEDBACK_CRITICAl_PRIORITY;
        break;
    }
    return FEEDBACK_BASE_PRIORITY + priority;
  }

  public void setItemDescription(String s){
    // do nothing, fool the json mapper!
  }

  public void setItemHeader(String s){
    // do nothing, fool the json mapper!
  }

  public void setItemState(EState s){
    // do nothing, fool the json mapper!
  }

  public void setItemPriority(int i){
    // do nothing, fool the json mapper!
  }
}
