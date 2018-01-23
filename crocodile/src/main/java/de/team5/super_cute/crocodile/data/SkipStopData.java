package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.SkipStop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class SkipStopData extends BaseData<SkipStop> {

  @Autowired
  public SkipStopData(HibernateTemplate template) {
    super(SkipStop.class, template);
  }

}
