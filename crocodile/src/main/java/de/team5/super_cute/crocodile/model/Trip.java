package de.team5.super_cute.crocodile.model;

import static javax.persistence.TemporalType.DATE;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Temporal;
import org.hibernate.annotations.Proxy;


@Entity
@Table(name = "trip")
@Proxy(lazy = false)
public class Trip extends IdentifiableObject implements Serializable {

  @Column
  private boolean isInbound;

  @ManyToOne
  @PrimaryKeyJoinColumn
  private Vehicle vehicle;

  @ManyToOne
  @PrimaryKeyJoinColumn
  private Line line;

  /**
  maps stopIds to departureTimes
   **/
  @ElementCollection(fetch = FetchType.EAGER)
  @MapKeyColumn(name = "stop_id")
  @Temporal(DATE)
  @Basic
  @JsonIgnore
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

  @JsonIgnore
  public Map<String, Calendar> getStops() {
    return stops;
  }

  public void setStops(
      Map<String, Calendar> stops) {
    this.stops = stops;
  }

  @JsonProperty("stops")
  public List<?> getStopsAsList() {
    return stops.entrySet().stream().map(entry -> new StopDepartureData(entry.getKey(),
        LocalDateTime.ofInstant(entry.getValue().toInstant(), ZoneId.systemDefault()))).collect(Collectors.toList());
  }

  public class StopDepartureData {
    @JsonProperty
    String id;
    @JsonProperty
    String departureTime;

    public StopDepartureData(String id, LocalDateTime departureTime) {
      this.id = id;
      this.departureTime = departureTime.toString();
    }
  }
}
