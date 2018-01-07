package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import de.team5.super_cute.crocodile.util.ColorConverter;
import java.awt.Color;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.MapKeyColumn;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.persistence.Transient;
import org.hibernate.annotations.Proxy;

@Entity
@Table(name = "line")
@Proxy(lazy = false)
public class Line extends IdentifiableObject implements Serializable, Feedbackable, Stateable {

  @Column
  private String name;

  @ManyToMany(fetch = FetchType.LAZY)
  @OrderColumn
  @JoinTable(
      name = "Line_Stops_InB",
      joinColumns = @JoinColumn(name = "line_id"),
      inverseJoinColumns = @JoinColumn(name = "stop_id")
  )
  private List<Stop> stopsInbound;

  @ManyToMany(fetch = FetchType.LAZY)
  @OrderColumn
  @JoinTable(
      name = "Line_Stops_OutB",
      joinColumns = @JoinColumn(name = "line_id"),
      inverseJoinColumns = @JoinColumn(name = "stop_id")
  )
  private List<Stop> stopsOutbound;

  @OrderColumn
  @ElementCollection(fetch = FetchType.LAZY)
  @MapKeyColumn(name = "stop_id_travel_time_inbound")
  private Map<String, Integer> travelTimeInbound;

  @ElementCollection(fetch = FetchType.LAZY)
  @MapKeyColumn(name = "stop_id_travel_time_outbound")
  private Map<String, Integer> travelTimeOutbound;

  @Column
  @Convert(converter = ColorConverter.class)
  @JsonIgnore //extra getter/setter fürs Json
  private Color color;

  @Transient
  private EState state;

  @Column
  private EVehicleType type;

  public Line() {
    super();
  }

  public Line(String name, List<Stop> stopsInbound,
      List<Stop> stopsOutbound, Map<String, Integer> travelTimeInbound,
      Map<String, Integer> travelTimeOutbound, Color color,
      EVehicleType type) {
    super();
    this.name = name;
    this.stopsInbound = stopsInbound;
    this.stopsOutbound = stopsOutbound;
    this.travelTimeInbound = travelTimeInbound;
    this.travelTimeOutbound = travelTimeOutbound;
    this.color = color;
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Stop> getStopsInbound() {
    return stopsInbound;
  }

  public void setStopsInbound(List<Stop> stopsInbound) {
    this.stopsInbound = stopsInbound;
  }

  public List<Stop> getStopsOutbound() {
    return stopsOutbound;
  }

  public void setStopsOutbound(List<Stop> stopsOutbound) {
    this.stopsOutbound = stopsOutbound;
  }

  public Color getColor() {
    return color;
  }

  public void setColor(Color color) {
    this.color = color;
  }

  @JsonGetter("color")
  public String getHexColor() {
    return String.format("#%02x%02x%02x", color.getRed(), color.getGreen(), color.getBlue());
  }

  @JsonSetter("color")
  public void setHexColor(String hexColor) {
    color = Color.decode(hexColor);
  }

  public EVehicleType getType() {
    return type;
  }

  public void setType(EVehicleType type) {
    this.type = type;
  }

  public Map<String, Integer> getTravelTimeInbound() {
    return travelTimeInbound;
  }

  public void setTravelTimeInbound(
      Map<String, Integer> travelTimeInbound) {
    this.travelTimeInbound = travelTimeInbound;
  }

  public Map<String, Integer> getTravelTimeOutbound() {
    return travelTimeOutbound;
  }

  public void setTravelTimeOutbound(
      Map<String, Integer> travelTimeOutbound) {
    this.travelTimeOutbound = travelTimeOutbound;
  }

  @Override
  public int getSeverity() {
    return 0;
  }

  @Override
  public EState getState() {
    return state;
  }

  public void setState(EState state) {
    this.state = state;
  }
}
