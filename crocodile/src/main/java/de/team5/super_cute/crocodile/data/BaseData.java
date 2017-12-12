package de.team5.super_cute.crocodile.data;

import java.util.ArrayList;
import java.util.List;

/**
 * Base class for all "...Data" classes.
 * Responsible for Database persistence.
 */
public abstract class BaseData<T> {

  final List<T> objects;

  BaseData() {
    objects = new ArrayList<>();
  }

  /**
   * @return all Trips currently in the system
   */
  public List<T> getData() {
    return objects;
  }

}
