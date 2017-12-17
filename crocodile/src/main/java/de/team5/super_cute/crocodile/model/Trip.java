package de.team5.super_cute.crocodile.model;

import static javax.persistence.TemporalType.DATE;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Map;
import javax.persistence.Basic;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Temporal;


@Entity
@Table(name="trip")
public class Trip extends IdentifiableObject implements Serializable {

  @OneToOne
  @PrimaryKeyJoinColumn
  private Vehicle vehicle;

  @ManyToOne
  @PrimaryKeyJoinColumn
  private Line line;

  @ElementCollection(fetch = FetchType.EAGER)
  @MapKeyColumn(name = "stop_id")
  @Temporal(DATE)
  @Basic
  private Map<String, Calendar> stops;

  public Trip() {}

  public Trip(Vehicle vehicle, Line line,
      Map<String, Calendar> stops) {
    super();
    this.vehicle = vehicle;
    this.line = line;
    this.stops = stops;
  }

  public Vehicle getVehicle() {
    return vehicle;
  }

  public void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
  }

  public Line getLine() {
    return line;
  }

  public void setLine(Line line) {
    this.line = line;
  }

  public Map<String, Calendar> getStops() {
    return stops;
  }

  public void setStops(
      Map<String, Calendar> stops) {
    this.stops = stops;
  }
}
