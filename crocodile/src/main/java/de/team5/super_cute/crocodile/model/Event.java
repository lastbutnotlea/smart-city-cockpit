package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.TickerConfig.EVENT_BASE_PRIORITY;

public class Event extends IdentifiableObject implements TickerItemable {

  //TODO
  @Override
  public String getItemDescription() {
    return "Party at university from 0:00 to 23:59";
  }

  @Override
  public String getItemHeader() {
    return "Planned event";
  }

  //TODO
  @Override
  public EState getItemState() {
    return EState.PROBLEMATIC;
  }

  //TODO
  @Override
  public int getItemPriority() {
    return EVENT_BASE_PRIORITY;
  }
}
