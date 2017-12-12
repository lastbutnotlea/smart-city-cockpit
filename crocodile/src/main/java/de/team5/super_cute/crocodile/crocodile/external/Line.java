package de.team5.super_cute.crocodile.crocodile.external;

import java.awt.Color;
import java.util.ArrayList;

public class Line{
  public String id;
  public String name;
  public ArrayList<Stop> stopsInbound;
  public ArrayList<Stop> stopsOutbound;
  Line(String id, String name, Color color, ArrayList<Stop> stopsInbound,ArrayList<Stop> stopsOutbound){
    this.id = id;
    this.name = name;
    this.stopsInbound = stopsInbound;
    this.stopsOutbound = stopsOutbound;
  }
}
