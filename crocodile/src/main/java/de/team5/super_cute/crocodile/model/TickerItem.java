package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.util.TickerItemableAttributeConverter;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Table;
import org.hibernate.annotations.Proxy;

@Entity
@Table(name = "tickerItem")
@Proxy(lazy = false)
public class TickerItem extends IdentifiableObject {

  @Column
  @Convert(converter = TickerItemableAttributeConverter.class)
  private TickerItemable item;

  public TickerItem() {
    super();
  }

  public TickerItem(TickerItemable item) {
    super();
    this.item = item;
  }

  public TickerItemable getItem() {
    return item;
  }

  public void setItem(TickerItemable item) {
    this.item = item;
  }
}
