package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

@Service
public class VehicleData extends BaseData<Vehicle> {

  @Autowired
  public VehicleData(HibernateTemplate template) {
    super(Vehicle.class, template);
  }

}
