package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_BASE_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_CRITICAL_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_FINE_PRIORITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.FEEDBACK_PROBLEMATIC_PRIORITY;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.team5.super_cute.crocodile.util.DateDeserializer;
import de.team5.super_cute.crocodile.util.DateSerializer;
import de.team5.super_cute.crocodile.util.FeedbackableAttributeConverter;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "feedback")
@org.hibernate.annotations.Entity(
    dynamicUpdate = true
)
public class Feedback extends IdentifiableObject implements Serializable, TickerItemable {

  @Column
  private String message;

  @Column
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  @JsonSerialize(using = DateSerializer.class)
  @JsonDeserialize(using = DateDeserializer.class)
  private LocalDateTime timestamp;

  @Column
  @Convert(converter = FeedbackableAttributeConverter.class)
  private ServiceOrFeedbackTargetObject objective;

  @Column
  private EFeedbackType feedbackType;

  @Column
  private EState rating;

  @Column
  private boolean processed;

  public Feedback() {
    super();
  }

  public Feedback(String message, LocalDateTime timestamp, ServiceOrFeedbackTargetObject objective,
      EFeedbackType feedbackType, EState rating, boolean processed) {
    super();
    this.message = message;
    this.timestamp = timestamp;
    this.objective = objective;
    this.feedbackType = feedbackType;
    this.rating = rating;
    this.processed = processed;
  }

  public Feedback(Feedback feedback) {
    this(feedback.message, feedback.timestamp, feedback.objective, feedback.feedbackType, feedback.rating, feedback.processed);
    setId(feedback.getId());
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public ServiceOrFeedbackTargetObject getObjective() {
    return objective;
  }

  public void setObjective(ServiceOrFeedbackTargetObject objective) {
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

  public boolean getProcessed() {
    return processed;
  }

  public void setProcessed(boolean processed) {
    this.processed = processed;
  }

  @Override
  public String getItemDescription() {
    return this.message;
  }

  public void setItemDescription(String s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public String getItemHeader() {
    String feedbackType = "";
    switch (this.getFeedbackType()) {
      case VEHICLE_FEEDBACK:
        feedbackType = "vehicles";
        break;
      case STOP_FEEDBACK:
        feedbackType = "stops";
        break;
    }
    return "Customer feedback about one of our " + feedbackType;
  }

  public void setItemHeader(String s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public EState getItemState() {
    return this.rating;
  }

  public void setItemState(EState s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public int getItemPriority() {
    int priority = 0;
    switch (this.rating) {
      case FINE:
        priority = FEEDBACK_FINE_PRIORITY;
        break;
      case PROBLEMATIC:
        priority = FEEDBACK_PROBLEMATIC_PRIORITY;
        break;
      case CRITICAL:
        priority = FEEDBACK_CRITICAL_PRIORITY;
        break;
    }
    return FEEDBACK_BASE_PRIORITY + priority;
  }

  public void setItemPriority(int i) {
    // do nothing, fool the json mapper!
  }
}
