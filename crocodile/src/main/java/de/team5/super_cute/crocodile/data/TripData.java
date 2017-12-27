package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Trip;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class TripData extends BaseData<Trip> {

  @Autowired
  public TripData(HibernateTemplate template) {
    super(Trip.class, template);
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  @Override
  public List<Trip> getData() {
    List <Trip> list = (List<Trip>) getHibernateTemplate().getSessionFactory().getCurrentSession()
        .createQuery("from " + Trip.class.getName()).list();
    for (Trip t:list) {
      getHibernateTemplate().initialize(t.getLine().getStopsInbound());
      getHibernateTemplate().initialize(t.getLine().getStopsOutbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeInbound());
      getHibernateTemplate().initialize(t.getLine().getTravelTimeOutbound());
    }
    return list;
  }

}
