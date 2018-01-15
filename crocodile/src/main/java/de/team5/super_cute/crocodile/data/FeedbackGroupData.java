package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.c4c.FeedbackGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class FeedbackGroupData extends BaseData<FeedbackGroup> {

  @Autowired
  public FeedbackGroupData(HibernateTemplate template) {
    super(FeedbackGroup.class, template);
  }

}
