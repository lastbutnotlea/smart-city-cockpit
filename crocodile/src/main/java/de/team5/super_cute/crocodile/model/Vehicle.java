package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.InitialSetupConfig.CAPACITY_INITIAL_MAX;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.CAPACITY_INITIAL_MIN;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.DELAY_INITIAL_MAX;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.DELAY_INITIAL_MIN;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.TEMPERATURE_INITIAL_MAX;
import static de.team5.super_cute.crocodile.config.InitialSetupConfig.TEMPERATURE_INITIAL_MIN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY_LIMIT_CRITICAL;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD_LIMIT_CRITICAL;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_LOWER_LIMIT_CRITICAL;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_LOWER_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_UPPER_LIMIT_CRITICAl;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_UPPER_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.SEVERITY_DIVISOR;
import static de.team5.super_cute.crocodile.config.TickerConfig.VEHICLE_BASE_PRIORITY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
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
public class Vehicle extends IdentifiableObject implements Serializable, Feedbackable, Stateable,
    TickerItemable {

  @Column
  private Integer capacity;

  @Column
  private Integer load;

  @Column
  private Integer temperature;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> defects;

  /**
   * The delay of the vehicle in seconds.
   */
  @Column
  private Integer delay;

  @Column
  private EVehicleType type;

  public Vehicle() {
    super();
  }

  public Vehicle(int capacity, int load, int delay, int temperature, EVehicleType type,
      Set<String> defects) {
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
    for (String d : this.defects) {
      if (d.equals(defect)) {
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
    if (getLoad() / getCapacity() < LOAD_LIMIT_PROBLEMATIC * 0.01) {
      return LiveDataConfig.LOAD_SEVERITY[0];
    } else if (getLoad() / getCapacity() < LOAD_LIMIT_CRITICAL * 0.01) {
      return LiveDataConfig.LOAD_SEVERITY[1];
    } else {
      return LiveDataConfig.LOAD_SEVERITY[2];
    }
  }

  @JsonIgnore
  public int getTemperatureSeverity() {
    if (getTemperature() < TEMPERATURE_UPPER_LIMIT_PROBLEMATIC
        && getTemperature() > TEMPERATURE_LOWER_LIMIT_PROBLEMATIC) {
      return LiveDataConfig.TEMPERATURE_SEVERITY[0];
    } else if ((getTemperature() <= TEMPERATURE_LOWER_LIMIT_PROBLEMATIC
        && getTemperature() > TEMPERATURE_LOWER_LIMIT_CRITICAL) || (
        getTemperature() < TEMPERATURE_UPPER_LIMIT_CRITICAl
            && getTemperature() >= TEMPERATURE_UPPER_LIMIT_PROBLEMATIC)) {
      return LiveDataConfig.TEMPERATURE_SEVERITY[1];
    } else {
      return LiveDataConfig.TEMPERATURE_SEVERITY[2];
    }
  }

  @JsonIgnore
  public int getDelaySeverity() {
    if (getDelay() < DELAY_LIMIT_PROBLEMATIC) {
      return LiveDataConfig.DELAY_SEVERITY[0];
    } else if (getDelay() < DELAY_LIMIT_CRITICAL) {
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
  public int getSeverity() {
    int severity = 0;
    for (String defect : defects) {
      severity += VEHICLE_DEFECTS_SEVERITY.get(defect);
    }
    return severity + getLoadSeverity() + getTemperatureSeverity() + getDelaySeverity();
  }

  public static Vehicle createRandom(EVehicleType vehicleType) {

    Vehicle vehicle = new Vehicle(
        getInitialValue(CAPACITY_INITIAL_MIN, CAPACITY_INITIAL_MAX),
        0,
        getInitialValue(DELAY_INITIAL_MIN, DELAY_INITIAL_MAX),
        getInitialValue(TEMPERATURE_INITIAL_MIN, TEMPERATURE_INITIAL_MAX),
        vehicleType, new HashSet<>());
    Random r = new Random(System.currentTimeMillis());
    vehicle.setLoad((int) ((r.nextInt(100) + 1) * 0.01 * vehicle.getCapacity()));
    return vehicle;
  }

  @Override
  public String getItemDescription() {
    String description = this.getId() + ":\n"
        + "load: " + this.getLoad() + "/" + this.getCapacity() + "\n"
        + "temperature: " + this.getTemperature() + "\n"
        + "delay: " + this.getDelay() + "\n"
        + "defects: ";
    Iterator<String> defects = this.getDefects().iterator();
    for(int i = 0; i < this.getDefects().size(); i++){
      if(i != 0){
        description += ", ";
      }
      description += defects.next();
    }
    return description;
  }

  @Override
  public String getItemHeader() {
    return "Vehicle state is critical";
  }

  @Override
  public EState getItemState() {
    return this.getState();
  }

  @Override
  public int getItemPriority() {
    return VEHICLE_BASE_PRIORITY + (this.getSeverity() - 10) / SEVERITY_DIVISOR;
  }

  public static int getInitialValue(int min, int max){
    Random r = new Random(System.currentTimeMillis());
    return r.nextInt(max - min + 1) + min;
  }

  public void setItemDescription(String s){
    // do nothing, fool the json mapper!
  }

  public void setItemHeader(String s){
    // do nothing, fool the json mapper!
  }

  public void setItemState(EState s){
    // do nothing, fool the json mapper!
  }

  public void setItemPriority(int i){
    // do nothing, fool the json mapper!
  }
}
