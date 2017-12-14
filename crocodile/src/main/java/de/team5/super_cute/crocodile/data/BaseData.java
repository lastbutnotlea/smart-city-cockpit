package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.Collections;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.HibernateTemplate;
import org.springframework.stereotype.Service;

/**
 * Base class for all "...Data" classes.
 * Responsible for Database persistence.
 */
@Transactional
@Service
public abstract class BaseData<T extends IdentifiableObject> {

  @Autowired
  private HibernateTemplate hibernateTemplate;

  //final List<T> objects;
  final Class<T> clazz;

  BaseData(Class<T> clazz) {
    //objects = new ArrayList<>();
    this.clazz = clazz;
  }

  /**
   * @return all Objects of Type T currently in the system
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
