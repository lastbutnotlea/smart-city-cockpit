package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Announcement;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnnouncementData extends BaseData<Announcement> {

  @Autowired
  public AnnouncementData(HibernateTemplate template) {
    super(Announcement.class, template);
  }


  public List<Announcement> getAnnouncementsForStopId(String stopId) {
    return (List<Announcement>) getCurrentSession().createSQLQuery(
        "select announcement.* from announcement join announcement_stop a on announcement.id = a.announcement_id\n"
            + "where stops_id = '" + stopId + "'").addEntity(Announcement.class).list();
  }
}
