package de.team5.super_cute.crocodile.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "line")
public class Line extends IdentifiableObject {

  public Line() {
    super();
  }
}
