package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.time.LocalDateTime;
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
  @Convert(converter = LocalDateTimeAttributeConverter.class)
  private LocalDateTime timeToLive;

  @Column
  private TickerItemable item;

  public TickerItem() {
    super();
  }

  public TickerItem(LocalDateTime timeToLive, TickerItemable item) {
    super();
    this.timeToLive = timeToLive;
    this.item = item;
  }

  public LocalDateTime getTimeToLive() {
    return timeToLive;
  }

  public void setTimeToLive(LocalDateTime timeToLive) {
    this.timeToLive = timeToLive;
  }

  public TickerItemable getItem() {
    return item;
  }

  public void setItem(TickerItemable item) {
    this.item = item;
  }
}
