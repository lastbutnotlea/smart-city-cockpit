package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.TickerItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class TickerItemData extends BaseData<TickerItem> {

  @Autowired
  public TickerItemData(HibernateTemplate template) {
    super(TickerItem.class, template);
  }
}
