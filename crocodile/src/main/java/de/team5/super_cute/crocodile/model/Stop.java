package de.team5.super_cute.crocodile.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "stop")
public class Stop extends IdentifiableObject implements Serializable {

  @Column
  private String commonName;

  @Column
  private Double longitude;

  @Column
  private Double latitude;

  @Column
  private Integer peopleWaiting;

  @Column
  private String apiIp;

  public Stop() { super(); }

  public Stop(String apiId, String commonName, double longitude, double latitude, int peopleWaiting) {
    super();
    this.apiIp = apiId;
    this.commonName = commonName;
    this.longitude = longitude;
    this.latitude = latitude;
    this.peopleWaiting = peopleWaiting;
  }

  public String getApiIp() {
    return apiIp;
  }

  public void setApiIp(String apiIp) {
    this.apiIp = apiIp;
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
