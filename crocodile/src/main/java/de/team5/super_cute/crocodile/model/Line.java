package de.team5.super_cute.crocodile.model;

import java.awt.Color;
import java.util.ArrayList;
import java.util.Dictionary;

public class Line extends IdentifiableObject {

  private String name;
  private ArrayList<Stop> stopsInbound;
  private ArrayList<Stop> stopsOutbound;
  private Dictionary<String, Integer> travelTimeInbound;
  private Dictionary<String, Integer> travelTimeOutbound;
  private Color color;

  public Line() {
    super();
  }

  public Line(String name, ArrayList<Stop> stopsInbound,
      ArrayList<Stop> stopsOutbound,
      Dictionary<String, Integer> travelTimeInbound,
      Dictionary<String, Integer> travelTimeOutbound, Color color) {
    super();
    this.name = name;
    this.stopsInbound = stopsInbound;
    this.stopsOutbound = stopsOutbound;
    this.travelTimeInbound = travelTimeInbound;
    this.travelTimeOutbound = travelTimeOutbound;
    this.color = color;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ArrayList<Stop> getStopsInbound() {
    return stopsInbound;
  }

  public void setStopsInbound(ArrayList<Stop> stopsInbound) {
    this.stopsInbound = stopsInbound;
  }

  public ArrayList<Stop> getStopsOutbound() {
    return stopsOutbound;
  }

  public void setStopsOutbound(ArrayList<Stop> stopsOutbound) {
    this.stopsOutbound = stopsOutbound;
  }

  public Color getColor() {
    return color;
  }

  public void setColor(Color color) {
    this.color = color;
  }

  public Dictionary<String, Integer> getTravelTimeInbound() {
    return travelTimeInbound;
  }

  public void setTravelTimeInbound(
      Dictionary<String, Integer> travelTimeInbound) {
    this.travelTimeInbound = travelTimeInbound;
  }

  public Dictionary<String, Integer> getTravelTimeOutbound() {
    return travelTimeOutbound;
  }

  public void setTravelTimeOutbound(
      Dictionary<String, Integer> travelTimeOutbound) {
    this.travelTimeOutbound = travelTimeOutbound;
  }
}
