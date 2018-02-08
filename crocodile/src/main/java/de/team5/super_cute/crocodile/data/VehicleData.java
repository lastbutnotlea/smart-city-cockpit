package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class VehicleData extends BaseData<Vehicle> {

  @Autowired
  public VehicleData(HibernateTemplate template) {
    super(Vehicle.class, template);
  }

  public List<Vehicle> getVehiclesWithTypeFreeFrom(EVehicleType type, LocalDateTime time) {
    String timestamp = new LocalDateTimeAttributeConverter().convertToDatabaseColumn(time).toString();
    return (List<Vehicle>) hibernateTemplate.getSessionFactory().getCurrentSession()
        .createQuery("from " + Vehicle.class.getName() + " where type = " + type.ordinal()
            + " and isshutdown = FALSE and freefrom < '" + timestamp + "'").list();
  }
}
