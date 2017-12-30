package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class FeedbackData extends BaseData<Feedback> {

  @Autowired
  public FeedbackData(HibernateTemplate template) {
    super(Feedback.class, template);
  }

}
