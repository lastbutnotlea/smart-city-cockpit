package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.List;
import javax.transaction.Transactional;
import org.hibernate.Session;
import org.springframework.orm.hibernate5.HibernateTemplate;

/**
 * Base class for all "...Data" classes. Responsible for Database persistence.
 */
@Transactional
public abstract class BaseData<T extends IdentifiableObject> {

  private final HibernateTemplate hibernateTemplate;

  public HibernateTemplate getHibernateTemplate() {
    return hibernateTemplate;
  }

  final Class<T> clazz;

  BaseData(Class<T> clazz, HibernateTemplate hibernateTemplate) {
    this.clazz = clazz;
    this.hibernateTemplate = hibernateTemplate;
  }

  /**
   * @return all Objects of Type T currently in the system
   */
  public List<T> getData() {
    return (List<T>) getCurrentSession().createQuery("from " + clazz.getName()).list();
  }

  public T getObjectForId(String id) {
    List<T> objects = (List<T>) getCurrentSession()
        .createQuery("from " + clazz.getName() + " C where C.id = '" + id + "'").list();
    return objects.size() == 0 ? null : objects.get(0);
  }

  public boolean addObject(T obj) {
    if (hibernateTemplate.get(clazz.getName(), obj.getId()) == null) {
      hibernateTemplate.save(obj);
    }
    return true;
  }

  public boolean editObject(T obj) {
    hibernateTemplate.update(obj);
    return true;
  }

  public boolean deleteObject(String id) {
    Object objToDelete = hibernateTemplate.get(clazz.getName(), id);
    hibernateTemplate.delete(objToDelete);
    return true;
  }

  protected Session getCurrentSession() {
    return hibernateTemplate.getSessionFactory().getCurrentSession();
  }
}
