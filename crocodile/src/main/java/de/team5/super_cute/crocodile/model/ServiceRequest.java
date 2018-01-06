package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;
import java.time.LocalDateTime;
import java.util.List;

public class ServiceRequest extends C4CEntity {

  private static final String CLEANING_TYPE_CODE = "ZCLN";
  private static final String MAINTENANCE_TYPE_CODE = "SRRQ";

  @C4CProperty(name = "Name", metadataType = "c4codata.EXTENDED_Name")
  private String name;

  @C4CProperty(name = "CustomerID")
  @JsonIgnore
  private String customerId = "4000560"; // Id unserer Gruppe

  @C4CProperty(name = "ServicePriorityCode", maxLength = 8)
  private String priority = "3"; // normal

  @C4CProperty(name = "ServiceRequestLifeCycleStatusCode")
  private String statusCode = "1"; // open todo safe strings to get string meanings from number code?

  @C4CProperty(name = "CompletionDueDate")
  private LocalDateTime dueDate;
  /**
   * not set by user, only in SAP
   */
  @C4CProperty(name = "CompletionOnDate")
  private LocalDateTime completionDate;

  @C4CProperty(name = "DataOriginTypeCode")
  @JsonIgnore
  private String originTypeCode = "1";

  @C4CProperty(name = "ProcessingTypeCode")
  @JsonIgnore
  private String processingTypeCode;

  private EServiceType type;

  @C4CProperty(name = "ServiceRequestDescription")
  private List<C4CNotes> ServiceRequestDescription;

  /**
   * The id of the target entity;
   */
  @C4CProperty(name = "RefID", maxLength = 36)
  private String target;

  /**
   * The id of the feedback this service request answers to.
   */
  @C4CProperty(name = "FeedbackReference", maxLength = 36)
  private String referencedFeedback;

  public ServiceRequest() {
  }

  public ServiceRequest(String name, String priority, String statusCode,
      LocalDateTime dueDate, EServiceType type,
      List<C4CNotes> serviceRequestDescription, String target, String referencedFeedback) {
    this.name = name;
    this.priority = priority;
    this.statusCode = statusCode;
    this.dueDate = dueDate;
    this.type = type;
    ServiceRequestDescription = serviceRequestDescription;
    this.target = target;
    this.referencedFeedback = referencedFeedback;
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

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(String statusCode) {
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
    return processingTypeCode;
  }

  public void setProcessingTypeCode(String processingTypeCode) {
    this.processingTypeCode = processingTypeCode;
  }

  public EServiceType getType() {
    switch (this.processingTypeCode) {
      case CLEANING_TYPE_CODE:
        return EServiceType.CLEANING;
      case MAINTENANCE_TYPE_CODE:
        return EServiceType.MAINTENANCE;
      default:
        return type;
    }
  }

  public void setType(EServiceType type) {
    this.type = type;
    switch (type) {
      case CLEANING:
        this.processingTypeCode = CLEANING_TYPE_CODE;
        break;
      case MAINTENANCE:
        this.processingTypeCode = MAINTENANCE_TYPE_CODE;
        break;
    }
  }

  public List<C4CNotes> getServiceRequestDescription() {
    return ServiceRequestDescription;
  }

  public void setServiceRequestDescription(
      List<C4CNotes> serviceRequestDescription) {
    ServiceRequestDescription = serviceRequestDescription;
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
}
