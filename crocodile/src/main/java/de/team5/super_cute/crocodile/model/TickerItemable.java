package de.team5.super_cute.crocodile.model;

public interface TickerItemable {
  String getId();
  String getItemDescription();
  String getItemHeader();
  EState getItemState();
  //Value from 0 to 10; only n highest items are shown
  int getItemPriority();
}
