package de.team5.super_cute.crocodile.data;

import static de.team5.super_cute.crocodile.util.Helpers.makeIdToJSON;

import de.team5.super_cute.crocodile.model.Feedback;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class FeedbackData extends BaseData<Feedback> {

  private ArrayList<String> processedFeedback;

  @Autowired
  public FeedbackData(HibernateTemplate template) {
    super(Feedback.class, template);
    processedFeedback = new ArrayList<>();
  }

  @Override
  public List<Feedback> getData() {
    return super.getData().stream()
        .peek(f -> getHibernateTemplate().evict(f))
        .peek(this::setProcessed)
        .collect(Collectors.toList());
  }

  public String processFeedback(String feedbackId, boolean processed) {
    Feedback feedback = new Feedback(getObjectForId(feedbackId));
    feedback.setProcessed(processed);
    if (processed) {
      processedFeedback.add(feedbackId);
    } else {
      if (processedFeedback.contains(feedbackId)) {
        processedFeedback.remove(feedbackId);
      }
    }
    return makeIdToJSON(feedbackId);
  }

  private void setProcessed(Feedback feedback) {
    if (processedFeedback.contains(feedback.getId())) {
      feedback.setProcessed(true);
    } else {
      feedback.setProcessed(false);
    }
  }

}
