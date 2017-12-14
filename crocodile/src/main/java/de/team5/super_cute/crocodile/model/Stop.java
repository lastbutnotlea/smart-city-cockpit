package de.team5.super_cute.crocodile.model;

public class Stop extends IdentifiableObject {
  private String commonName;
  private double longitude;
  private double latitude;
  private int peopleWaiting;
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

  public double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public int getPeopleWaiting() {
    return peopleWaiting;
  }

  public void setPeopleWaiting(int peopleWaiting) {
    this.peopleWaiting = peopleWaiting;
  }
}
