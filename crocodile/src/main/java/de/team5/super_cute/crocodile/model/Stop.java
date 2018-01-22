package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING_LIMIT_CRITICAL;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING_LIMIT_PROBLEMATIC;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.TickerConfig.SEVERITY_DIVISOR;
import static de.team5.super_cute.crocodile.config.TickerConfig.STOP_BASE_PRIORITY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;

@Entity
@Table(name = "stop")
@JsonTypeName("stop")
public class Stop extends IdentifiableObject implements Serializable, Stateable, TickerItemable,
    ServiceOrFeedbackTargetObject {

  @Column
  private String commonName;

  @Column
  private Double longitude;

  @Column
  private Double latitude;

  @Column
  private Integer peopleWaiting;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> defects;

  public Stop() {
    super();
  }

  public Stop(String id, String commonName, double longitude, double latitude, int peopleWaiting,
      String... defects) {
    super();
    setId(id);
    this.commonName = commonName;
    this.longitude = longitude;
    this.latitude = latitude;
    this.peopleWaiting = peopleWaiting;
    this.defects = new HashSet<>(Arrays.asList(defects));
    ;
  }

  public Stop(String id, String commonName, Double longitude, Double latitude,
      Integer peopleWaiting,
      Set<String> defects) {
    super();
    setId(id);
    this.commonName = commonName;
    this.longitude = longitude;
    this.latitude = latitude;
    this.peopleWaiting = peopleWaiting;
    this.defects = defects;
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

  public String getCommonName() {
    return commonName;
  }

  public void setCommonName(String commonName) {
    this.commonName = commonName;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public Integer getPeopleWaiting() {
    return peopleWaiting;
  }

  public void setPeopleWaiting(int peopleWaiting) {
    this.peopleWaiting = peopleWaiting;
  }

  @JsonIgnore
  public int getPeopleWaitingSeverity() {
    if (getPeopleWaiting() < PEOPLE_WAITING_LIMIT_PROBLEMATIC) {
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[0];
    } else if (getPeopleWaiting() < PEOPLE_WAITING_LIMIT_CRITICAL) {
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[1];
    } else {
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[2];
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
      severity += STOP_DEFECTS_SEVERITY.get(defect);
    }
    return severity + getPeopleWaitingSeverity();
  }

  @Override
  public String getItemDescription() {
    String description = "Stop " + this.getId() + ":<br />"
        + "people waiting: " + this.getPeopleWaiting() + "<br />"
        + "defects: ";
    Iterator<String> defects = this.getDefects().iterator();
    for (int i = 0; i < this.getDefects().size(); i++) {
      if (i != 0) {
        description += ", ";
      }
      description += defects.next();
    }
    return description;
  }

  public void setItemDescription(String s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public String getItemHeader() {
    return "Stop state is critical";
  }

  public void setItemHeader(String s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public EState getItemState() {
    return this.getState();
  }

  public void setItemState(EState s) {
    // do nothing, fool the json mapper!
  }

  @Override
  public int getItemPriority() {
    return STOP_BASE_PRIORITY + (this.getSeverity() - 11) / SEVERITY_DIVISOR;
  }

  public void setItemPriority(int i) {
    // do nothing, fool the json mapper!
  }
}
