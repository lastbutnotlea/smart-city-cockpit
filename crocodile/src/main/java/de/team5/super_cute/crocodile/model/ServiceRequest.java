package de.team5.super_cute.crocodile.model;

import static de.team5.super_cute.crocodile.util.Helpers.DUMMY_TIME;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;
import de.team5.super_cute.crocodile.model.c4c.C4CEntity;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EStatusCode;
import de.team5.super_cute.crocodile.util.Helpers;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

public class ServiceRequest extends C4CEntity {

  @C4CProperty(name = "Name", metadataType = "c4codata.EXTENDED_Name")
  private String name;

  @C4CProperty(name = "CustomerID")
  @JsonIgnore
  private String customerId = Helpers.SAP_ACCOUNT_ID;

  @C4CProperty(name = "CreatedBy")
  @JsonIgnore
  private String createdBy = "Uni Augsburg02"; // unsere Gruppe

  @C4CProperty(name = "ServicePriorityCode", maxLength = 8)
  private EState priority = EState.FINE;

  @C4CProperty(name = "ServiceRequestLifeCycleStatusCode")
  private EStatusCode statusCode = EStatusCode.OPEN;

  @C4CProperty(name = "CompletionDueDate")
  private LocalDateTime dueDate;

  /**
   * not set by user, only in SAP
   */
  @C4CProperty(name = "CompletedOnDate")
  private LocalDateTime completionDate = DUMMY_TIME;

  @C4CProperty(name = "DataOriginTypeCode")
  @JsonIgnore
  private String originTypeCode = "1"; // Manual Data Entry

  @C4CProperty(name = "ProcessingTypeCode")
  @JsonIgnore
  private String processingTypeCode;

  private EServiceType type;

  @C4CProperty(name = "ServiceRequestDescription", hasAssociatedEntities = true)
  private List<C4CNotes> serviceRequestDescription;

  /**
   * The id of the target entity;
   */
  //@C4CProperty(name = "RefID", maxLength = 36) todo uncomment if mhp created them
  private String target;

  /**
   * The id of the feedback this service request answers to.
   */
  //@C4CProperty(name = "FeedbackReference", maxLength = 36) todo uncomment if mhp created them
  private String referencedFeedback;

  public ServiceRequest() {
  }

  public ServiceRequest(String name, EState priority,
      LocalDateTime dueDate, EServiceType type,
      List<C4CNotes> serviceRequestDescription, String target, String referencedFeedback) {
    setName(name);
    setPriority(priority);
    setDueDate(dueDate);
    setType(type);
    setServiceRequestDescription(serviceRequestDescription);
    setTarget(target);
    setReferencedFeedback(referencedFeedback);
  }


  @Override
  public String getCollectionName() {
    return "ServiceRequestCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new ServiceRequest();
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCustomerId() {
    return customerId;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public EState getPriority() {
    return priority;
  }

  public void setPriority(EState priority) {
    this.priority = priority;
  }

  public EStatusCode getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(EStatusCode statusCode) {
    this.statusCode = statusCode;
  }

  public LocalDateTime getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDateTime dueDate) {
    this.dueDate = dueDate;
  }

  public LocalDateTime getCompletionDate() {
    return completionDate;
  }

  public void setCompletionDate(LocalDateTime completionDate) {
    this.completionDate = completionDate;
  }

  public String getOriginTypeCode() {
    return originTypeCode;
  }

  public void setOriginTypeCode(String originTypeCode) {
    this.originTypeCode = originTypeCode;
  }

  public String getProcessingTypeCode() {
    if (this.type != null) {
      return this.type.getCode();
    }
    return processingTypeCode;
  }

  public void setProcessingTypeCode(String processingTypeCode) {
    this.processingTypeCode = processingTypeCode;
    this.type = EServiceType.getServiceType(processingTypeCode);
  }

  public EServiceType getType() {
    if (this.processingTypeCode != null) {
      return EServiceType.getServiceType(this.processingTypeCode);
    }
    return type;
  }

  public void setType(EServiceType type) {
    this.type = type;
    this.processingTypeCode = type.getCode();
  }

  public List<C4CNotes> getServiceRequestDescription() {
    return serviceRequestDescription;
  }

  public void setServiceRequestDescription(
      List<C4CNotes> serviceRequestDescription) {
    this.serviceRequestDescription = serviceRequestDescription;
  }

  public String getTarget() {
    return target;
  }

  public void setTarget(String target) {
    this.target = target;
  }

  public String getReferencedFeedback() {
    return referencedFeedback;
  }

  public void setReferencedFeedback(String referencedFeedback) {
    this.referencedFeedback = referencedFeedback;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (!(o instanceof ServiceRequest)) {
      return false;
    }

    ServiceRequest that = (ServiceRequest) o;

    return new EqualsBuilder()
        .append(getName(), that.getName())
        .append(getCustomerId(), that.getCustomerId())
        .append(getPriority(), that.getPriority())
        .append(getStatusCode(), that.getStatusCode())
        //.append(getDueDate(), that.getDueDate())
        .append(getCompletionDate(), that.getCompletionDate())
        .append(getOriginTypeCode(), that.getOriginTypeCode())
        .append(getProcessingTypeCode(), that.getProcessingTypeCode())
        .append(getType(), that.getType())
        .append(getServiceRequestDescription(), that.getServiceRequestDescription())
        //.append(getTarget(), that.getTarget())
        //.append(getReferencedFeedback(), that.getReferencedFeedback())
        .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
        .append(getName())
        .append(getCustomerId())
        .append(getPriority())
        .append(getStatusCode())
        //.append(getDueDate())
        .append(getCompletionDate())
        .append(getOriginTypeCode())
        .append(getProcessingTypeCode())
        .append(getType())
        .append(getServiceRequestDescription())
        //.append(getTarget())
        //.append(getReferencedFeedback()) todo uncomment if mhp guys created field
        .toHashCode();
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("name", getName())
        .append("customerId", getCustomerId())
        .append("createdBy", getCreatedBy())
        .append("priority", getPriority())
        .append("statusCode", getStatusCode())
        .append("dueDate", getDueDate())
        .append("completionDate", getCompletionDate())
        .append("originTypeCode", getOriginTypeCode())
        .append("processingTypeCode", getProcessingTypeCode())
        .append("type", getType())
        .append("serviceRequestDescription", getServiceRequestDescription())
        .append("target", getTarget())
        .append("referencedFeedback", getReferencedFeedback())
        .toString();
  }
}
