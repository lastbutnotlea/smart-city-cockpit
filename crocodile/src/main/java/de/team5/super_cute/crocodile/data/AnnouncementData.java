package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Announcement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnnouncementData extends BaseData<Announcement> {

    @Autowired
    public AnnouncementData(HibernateTemplate template) {
        super(Announcement.class, template);
    }
}
