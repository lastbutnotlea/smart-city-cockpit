package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.util.FeedbackableAttributeConverter;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback extends IdentifiableObject implements Serializable {

    @Column
    private String message;

    @Column
    @Convert(converter = LocalDateTimeAttributeConverter.class)
    private LocalDateTime timestamp;

    @Column
    @Convert(converter = FeedbackableAttributeConverter.class)
    private Feedbackable objective;

    @Column
    private FeedbackType feedbackType;

    public Feedback() {
        super();
    }

    public Feedback(String message, LocalDateTime timestamp, Feedbackable objective, FeedbackType feedbackType) {
        super();
        this.message = message;
        this.timestamp = timestamp;
        this.objective = objective;
        this.feedbackType = feedbackType;
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

    public Feedbackable getObjective() {
        return objective;
    }

    public void setObjective(Feedbackable objective) {
        this.objective = objective;
    }

    public FeedbackType getFeedbackType() {
        return feedbackType;
    }

    public void setFeedbackType(FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }
}
