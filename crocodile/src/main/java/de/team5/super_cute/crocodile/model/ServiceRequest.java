package de.team5.super_cute.crocodile.model;

import de.team5.super_cute.crocodile.external.C4CProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class ServiceRequest extends C4CEntity {

  @C4CProperty(name = "ProductID")
  public String vehicleId;

  /**
   * Achtung: nach dem ersten Zeichen wir die Priorität von SAP abgeschnitten
   */
  @C4CProperty(name = "ServicePriorityCode")
  public String priority;

  public ServiceRequest() {
  }

  public ServiceRequest(String vehicleId, String priority) {
    this.vehicleId = vehicleId;
    this.priority = priority;
  }

  public ServiceRequest(String id, String vehicleId, String priority) {
    this.id = id;
    this.vehicleId = vehicleId;
    this.priority = priority;
  }

  @Override
  public String getCollectionName() {
    return "ServiceRequestCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new ServiceRequest();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("vehicleId", vehicleId)
        .append("priority", priority)
        .append("id", id)
        .append("objectId", objectId)
        .toString();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ServiceRequest that = (ServiceRequest) o;

    return new EqualsBuilder()
        .append(id.toLowerCase(), that.id.toLowerCase())
        .append(vehicleId.toLowerCase(), that.vehicleId.toLowerCase())
        .append(
            priority.toLowerCase().substring(0, 1), that.priority.toLowerCase().substring(0, 1))
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(id.toLowerCase())
        .append(vehicleId.toLowerCase())
        .append(priority.toLowerCase().substring(0, 1))
        .toHashCode();
  }
}
