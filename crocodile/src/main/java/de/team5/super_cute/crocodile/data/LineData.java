package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Line;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class LineData extends BaseData<Line> {

  @Autowired
  public LineData(HibernateTemplate template) {
    super(Line.class, template);
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  public List<Line> getData() {
    List <Line> list = (List<Line>) getHibernateTemplate().getSessionFactory().getCurrentSession()
        .createQuery("from " + clazz.getName()).list();
    for (Line l:list) {
      getHibernateTemplate().initialize(l.getStopsInbound());
      getHibernateTemplate().initialize(l.getStopsOutbound());
      getHibernateTemplate().initialize(l.getTravelTimeInbound());
      getHibernateTemplate().initialize(l.getTravelTimeOutbound());
    }
    return list;
  }

}
