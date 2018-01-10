package de.team5.super_cute.crocodile.model.c4c;

import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import org.hibernate.annotations.Proxy;

/**
 * Represents a set of Feedbacks that are all "answered to" by the same Service Request
 */
@Entity
@Table(name = "feedback_group")
@Proxy(lazy = false)
public class FeedbackGroup extends IdentifiableObject {

  @OneToMany(fetch = FetchType.LAZY)
  @PrimaryKeyJoinColumn
  private Set<Feedback> feedbacks;

  public FeedbackGroup(Set<Feedback> feedbacks) {
    this.feedbacks = feedbacks;
  }

  public Set<Feedback> getFeedbacks() {
    return feedbacks;
  }

  public void setFeedbacks(Set<Feedback> feedbacks) {
    this.feedbacks = feedbacks;
  }
}
