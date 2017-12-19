package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Line;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class LineData extends BaseData<Line> {

  @Autowired
  public LineData(HibernateTemplate template) {
    super(Line.class, template);
  }

}
