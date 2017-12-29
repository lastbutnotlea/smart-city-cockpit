package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS_SEVERITY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.util.StateCalculator;
import java.io.Serializable;
import java.util.Set;
import javax.persistence.*;

@Entity
@Table(name = "stop")
public class Stop extends IdentifiableObject implements Serializable, Feedbackable, Stateable {

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

  public Stop() { super(); }

  public Stop(String id, String commonName, double longitude, double latitude, int peopleWaiting, Set<String> defects) {
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

  public void addDefect(String defect){
    for (String d:this.defects) {
      if(d.equals(defect)){
        return;
      }
    }
    this.defects.add(defect);
  }

  public boolean removeDefect(String defect){
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
    if(getPeopleWaiting() <= 300){
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[0];
    }
    else if(getPeopleWaiting() <= 700){
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[1];
    }
    else{
      return LiveDataConfig.PEOPLE_WAITING_SEVERITY[2];
    }
  }

  @Override
  public EState getState() {
    return StateCalculator.getState(getSeverity());
  }

  @JsonIgnore
  public int getSeverity(){
    int severity = 0;
    for (String defect:defects) {
      severity += STOP_DEFECTS_SEVERITY.get(defect);
    }
    return severity + getPeopleWaitingSeverity();
  }
}
