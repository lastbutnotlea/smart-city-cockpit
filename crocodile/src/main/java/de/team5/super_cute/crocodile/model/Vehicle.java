package de.team5.super_cute.crocodile.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "vehicle")
public class Vehicle extends IdentifiableObject implements Serializable {

  @Column
  private Integer capacity;

  @Column
  private Integer delay;

  @Column
  private Integer temperature;

  @ElementCollection
  private List<String> defects;

  @Column
  private EVehicleType type;

  public Vehicle() {}

  public Vehicle(int capacity, int delay, int temperature, List<String> defects,
      EVehicleType type) {
    super();
    this.capacity = capacity;
    this.delay = delay;
    this.temperature = temperature;
    this.defects = defects;
    this.type = type;
  }

  public Vehicle(int capacity, int delay, int temperature,
      EVehicleType type, String... defects) {
    this.capacity = capacity;
    this.delay = delay;
    this.temperature = temperature;
    this.type = type;
    this.defects = new ArrayList<>(Arrays.asList(defects));
  }

  public Integer getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }

  public Integer getDelay() {
    return delay;
  }

  public void setDelay(int delay) {
    this.delay = delay;
  }

  public Integer getTemperature() {
    return temperature;
  }

  public void setTemperature(int temperature) {
    this.temperature = temperature;
  }

  public List<String> getDefects() {
    return defects;
  }

  public void setDefects(List<String> defects) {
    this.defects = defects;
  }

  public EVehicleType getType() {
    return type;
  }

  public void setType(EVehicleType type) {
    this.type = type;
  }
}
