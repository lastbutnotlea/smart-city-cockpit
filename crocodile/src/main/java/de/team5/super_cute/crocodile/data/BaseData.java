package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.Trip;
import java.util.Collections;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;

/**
 * Base class for all "...Data" classes.
 * Responsible for Database persistence.
 */
@Transactional
public abstract class BaseData<T extends IdentifiableObject> {

  @Autowired
  private HibernateTemplate hibernateTemplate;

  final Class<T> clazz;

  BaseData(Class<T> clazz) {
    this.clazz = clazz;
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  public List<T> getData() {
    return (List<T>) hibernateTemplate.getSessionFactory().getCurrentSession().createQuery("from " + clazz.getName()).list();
  }

  public boolean addObject(T obj) {
    if (hibernateTemplate.get(obj.getClass().getName(), obj.getId()) == null) {
      hibernateTemplate.save(obj);
    }
    return true;
  }

  public boolean editObject(T newObj) {
    hibernateTemplate.update(newObj);
    return true;
  }

  public boolean deleteObject(String id) {
    Object objToDelete = hibernateTemplate.get(clazz.getName(), id);
    hibernateTemplate.delete(objToDelete);
    return true;
  }

}
