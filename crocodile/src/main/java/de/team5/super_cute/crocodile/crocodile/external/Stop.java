package de.team5.super_cute.crocodile.crocodile.external;

public class Stop{

  public String id;
  public String commonName;
  public double longitude;
  public double latitude;

  public Stop(String id, String commonName, double longitude, double latitude, int i) {
    this.id = id;
    this.commonName = commonName;
    this.longitude = longitude;
    this.latitude = latitude;
  }

  @Override
  public boolean equals(Object other) {
    Stop stop = (Stop)other;
    return (this.id.equals(stop.id) && this.commonName.equals(stop.commonName) && this.longitude == stop.longitude && this.latitude == stop.latitude);
  }
}
