package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_DEFECTS_SEVERITY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;
import org.hibernate.annotations.Proxy;

@Entity
@Table(name = "vehicle")
@Proxy(lazy = false)
public class Vehicle extends IdentifiableObject implements Serializable, Feedbackable, Stateable {

  @Column
  private Integer capacity;

  @Column
  private Integer load;

  @Column
  private Integer temperature;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> defects;

  @Column
  private Integer delay;

  @Column
  private EVehicleType type;

  public Vehicle() {
    super();
  }

  public Vehicle(int capacity, int load, int delay, int temperature, Set<String> defects,
      EVehicleType type) {
    super();
    this.capacity = capacity;
    this.load = load;
    this.delay = delay;
    this.temperature = temperature;
    this.defects = defects;
    this.type = type;
  }

  public Vehicle(int capacity, int load, int delay, int temperature,
      EVehicleType type, String... defects) {
    this.capacity = capacity;
    this.delay = delay;
    this.temperature = temperature;
    this.type = type;
    this.load = load;
    this.defects = new HashSet<String>(Arrays.asList(defects));
  }

  public Integer getCapacity() {
    return capacity;
  }

  public void setCapacity(int capacity) {
    this.capacity = capacity;
  }

  public Integer getLoad() {
    return load;
  }

  public void setLoad(Integer load) {
    this.load = load;
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

  public Set<String> getDefects() {
    return defects;
  }

  public void setDefects(Set<String> defects) {
    this.defects = defects;
  }

  public void addDefect(String defect) {
    for (String d:this.defects) {
      if(d.equals(defect)){
        return;
      }
    }
    this.defects.add(defect);
  }

  public boolean removeDefect(String defect) {
    return this.defects.remove(defect);
  }

  public EVehicleType getType() {
    return type;
  }

  public void setType(EVehicleType type) {
    this.type = type;
  }

  @JsonIgnore
  public int getLoadSeverity() {
    if (getLoad() / getCapacity() <= 0.5) {
      return LiveDataConfig.LOAD_SEVERITY[0];
    } else if (getLoad() / getCapacity() <= 1.5) {
      return LiveDataConfig.LOAD_SEVERITY[1];
    } else {
      return LiveDataConfig.LOAD_SEVERITY[2];
    }
  }

  @JsonIgnore
  public int getTemperatureSeverity() {
    if (getTemperature() <= 30 && getTemperature() >= 25) {
      return LiveDataConfig.TEMPERATURE_SEVERITY[0];
    } else if ((getTemperature() <= 24 && getTemperature() >= 15) || (getTemperature() <= 40
        && getTemperature() >= 31)) {
      return LiveDataConfig.TEMPERATURE_SEVERITY[1];
    } else {
      return LiveDataConfig.TEMPERATURE_SEVERITY[2];
    }
  }

  @JsonIgnore
  public int getDelaySeverity() {
    if (getDelay() <= 5) {
      return LiveDataConfig.DELAY_SEVERITY[0];
    } else if (getDelay() <= 15) {
      return LiveDataConfig.DELAY_SEVERITY[1];
    } else {
      return LiveDataConfig.DELAY_SEVERITY[2];
    }
  }

  @Override
  public EState getState() {
    return StateCalculator.getState(getSeverity());
  }

  public void setState(EState state) {
    // do nothing, fool the json mapper!
  }

  @JsonIgnore
  public int getSeverity(){
    int severity = 0;
    for (String defect:defects) {
      severity += VEHICLE_DEFECTS_SEVERITY.get(defect);
    }
    return severity + getLoadSeverity() + getTemperatureSeverity() + getDelaySeverity();
  }
}
