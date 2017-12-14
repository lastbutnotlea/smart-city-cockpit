package de.team5.super_cute.crocodile.model;

import static javax.persistence.TemporalType.DATE;

import java.util.Calendar;
import java.util.Map;
import javax.persistence.*;


@Entity
@Table(name="trip")
public class Trip extends IdentifiableObject {

  @OneToOne
  @PrimaryKeyJoinColumn
  private Vehicle vehicle;

  @ManyToOne
  @PrimaryKeyJoinColumn
  private Line line;

  @ElementCollection
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
