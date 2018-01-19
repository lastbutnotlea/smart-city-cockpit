package de.team5.super_cute.crocodile.model.c4c;

import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
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
  @JoinTable(
      name = "feedbacks",
      joinColumns = @JoinColumn(name = "fb_group_id"),
      inverseJoinColumns = @JoinColumn(name = "fb_id")
  )
  private Set<Feedback> feedbacks;

  public FeedbackGroup() {
    feedbacks = new HashSet<>();
  }

  public FeedbackGroup(Set<Feedback> feedbacks) {
    this.feedbacks = feedbacks;
  }

  public Set<Feedback> getFeedbacks() {
    return feedbacks;
  }

  public void setFeedbacks(Set<Feedback> feedbacks) {
    this.feedbacks = feedbacks;
  }

  public void addFeedbacksMinusDuplicates(Set<Feedback> feedbacks, FeedbackData feedbackData) {
    if (feedbacks == null) {
      return;
    }
    for (Feedback f : feedbacks) {
      Feedback fromDatabase = feedbackData.getObjectForId(f.getId());
      if (!getFeedbacks().contains(fromDatabase)) {
        getFeedbacks().add(fromDatabase);
      }
    }
    for (Feedback f : this.feedbacks) {
      if (!feedbacks.contains(f)) {
        this.feedbacks.remove(f);
      }
    }
  }
}
