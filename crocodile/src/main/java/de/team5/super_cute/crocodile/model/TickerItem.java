package de.team5.super_cute.crocodile.model;

public class TickerItem extends IdentifiableObject {

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
