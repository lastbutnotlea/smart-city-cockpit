package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.*;

import de.team5.super_cute.crocodile.util.LocalDateTimeAttributeConverter;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.Proxy;


@Entity
@Table(name = "trip")
@Proxy(lazy = false)
public class Trip extends IdentifiableObject implements Serializable {

  @Column
  private boolean isInbound;

  @ManyToOne(fetch = FetchType.LAZY)
  @PrimaryKeyJoinColumn
  private Vehicle vehicle;

  @ManyToOne(fetch = FetchType.LAZY)
  @PrimaryKeyJoinColumn
  private Line line;

  /**
  maps stopIds to departureTimes
   **/
  @JsonIgnore
  @ElementCollection(fetch = FetchType.LAZY)
  @MapKeyColumn(name = "stop_id")
  @Convert(converter = LocalDateTimeAttributeConverter.class, attributeName = "value")
  private Map<String, LocalDateTime> stops;

  public Trip() {super();}

  public Trip(Vehicle vehicle, Line line,
      Map<String, LocalDateTime> stops) {
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
  public Map<String, LocalDateTime> getStops() {
    return stops;
  }

  @JsonIgnore
  public void setStops(Map<String, LocalDateTime> stops) {
    this.stops = stops;
  }

  @JsonGetter("stops")
  public List<?> getStopsAsList() {
    return stops.entrySet().stream().map(entry -> {
      StopDepartureData data = new StopDepartureData();
      data.id = entry.getKey();
      data.departureTime = entry.getValue().toString();
      return data;
    }).collect(Collectors.toList());
  }

  @JsonSetter("stops")
  public void setStopsAsList(List<StopDepartureData> list) {
    try {
      stops = new HashMap<>(list.size());
      list.forEach(data -> {
        stops.put(data.id, LocalDateTime.parse(data.departureTime));
      });
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }
  }

  public static class StopDepartureData {
    @JsonProperty
    public String id;
    @JsonProperty
    public String departureTime;
  }
}
