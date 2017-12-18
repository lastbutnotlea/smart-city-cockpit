package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Stop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class StopData extends BaseData<Stop> {

  @Autowired public StopData(HibernateTemplate template) {
    super(Stop.class, template);
  }

}
