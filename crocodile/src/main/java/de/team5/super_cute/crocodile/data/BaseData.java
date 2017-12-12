package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.IdentifiableObject;
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
  private HibernateTemplate hibernateTemplate = new HibernateTemplate();

  //final List<T> objects;
  final Class<T> clazz;

  BaseData(Class<T> clazz) {
    //objects = new ArrayList<>();
    this.clazz = clazz;
  }

  /**
   * @return all Trips currently in the system
   */
  public List<T> getData() {
    return Collections.unmodifiableList(hibernateTemplate.loadAll(clazz));
  }

  public boolean addObject(T obj) {
    hibernateTemplate.save(obj);
    return true;
  }

  public boolean editObject(T newObj) {
    hibernateTemplate.update(newObj);
    return true;
  }

  public boolean deleteObject(T obj) {
    hibernateTemplate.delete(obj);
    return true;
  }

}
