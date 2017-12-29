package de.team5.super_cute.crocodile.model;

import java.io.Serializable;
import java.util.Set;
import javax.persistence.*;

@Entity
@Table(name = "stop")
public class Stop extends IdentifiableObject implements Serializable, Feedbackable {

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
}
