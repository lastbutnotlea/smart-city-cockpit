package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.FeedbackGroupData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.ServiceOrFeedbackTargetObject;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.model.c4c.FeedbackGroup;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.apache.olingo.odata2.api.batch.BatchException;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/servicerequests")
@Transactional
public class ServiceRequestController {

  private static final Logger logger = LoggerFactory.getLogger(ServiceRequestController.class);

  private SAPC4CConnector connector;
  private FeedbackGroupData feedbackGroupData;
  private FeedbackData feedbackData;
  private VehicleData vehicleData;
  private StopData stopData;

  //private List<ServiceRequest> cacheList;

  @Autowired
  public ServiceRequestController(SAPC4CConnector connector,
      FeedbackGroupData feedbackGroupData, VehicleData vehicleData,
      StopData stopData, FeedbackData feedbackData) {
    this.connector = connector;
    this.feedbackGroupData = feedbackGroupData;
    this.vehicleData = vehicleData;
    this.stopData = stopData;
    this.feedbackData = feedbackData;
    //cacheList = new ArrayList<>();
  }

  @GetMapping
  public List<ServiceRequest> getAllServiceRequests()
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for all Service Requests");
    List<ServiceRequest> serviceRequests = connector.getServiceRequests();
    //serviceRequests.addAll(cacheList);
    return serviceRequests;
  }

  @GetMapping("/{id}")
  public ServiceRequest getServiceRequest(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Service Request with id " + id);
    //Optional<ServiceRequest> serviceR = cacheList.stream().filter(s -> s.getId().equals(id)).findAny();
//    if (serviceR.isPresent()) {
//      return serviceR.get();
//    }
    ServiceRequest serviceRequest = connector.getServiceRequests().stream()
        .filter(sr -> sr.getId().equals(id)).findAny()
        .orElseThrow(() -> new IllegalArgumentException("No Service Request found for this id."));
    prepareServiceRequestForFrontend(serviceRequest);
    return serviceRequest;
  }

  @PostMapping
  public ServiceRequest addServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException {
    logger.info("Got Request to add Service Request: " + serviceRequestInput);
    handleServiceRequestFromFrontend(serviceRequestInput);
    //cacheList.add(serviceRequestInput);
    connector.putC4CEntity(serviceRequestInput, Helpers.POST);
    return serviceRequestInput;
  }

  @DeleteMapping("/{id}")
  public String deleteServiceRequest(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request to delete Service Request with id " + id);
//    cacheList.removeIf(s -> s.getId().equals(id));
//    return id;
    return connector.deleteC4CEntity(
        connector.getServiceRequests().stream().filter(sr -> sr.getId().equals(id)).findAny()
            .orElseThrow(() -> new IllegalArgumentException(
                "No Service Request found for the given id: " + id)));
  }

  @PutMapping
  public String editServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to edit Service Request: " + serviceRequestInput);
    //deleteServiceRequest(serviceRequestInput.getId());
    //addServiceRequest(serviceRequestInput);
    connector.putC4CEntity(serviceRequestInput, Helpers.PATCH);
    return serviceRequestInput.getId();
  }

  private void prepareServiceRequestForFrontend(ServiceRequest sr) {
    FeedbackGroup feedbackGroup = feedbackGroupData.getObjectForId(sr.getReferencedFeedback());
    if (feedbackGroup != null) {
      sr.setFeedbacks(feedbackGroup.getFeedbacks());
    } else {
      sr.setFeedbacks(new HashSet<>());
    }
    ServiceOrFeedbackTargetObject target = getTargetObject(sr);
    if (target != null) {
      sr.setTarget(target);
    }
  }

  private ServiceOrFeedbackTargetObject getTargetObject(ServiceRequest sr) {
    if (sr.getTargetId() == null) {
      return null;
    }
    if (sr.getTargetId().startsWith(Vehicle.class.getSimpleName())) {
      return vehicleData.getObjectForId(sr.getTargetId());
    } else {
      return stopData.getObjectForId(sr.getTargetId());
    }
  }

  private void handleServiceRequestFromFrontend(ServiceRequest sr) {
    if (sr.getId() == null) {
      sr.setId();
    }
    FeedbackGroup fbg = null;
    if (sr.getReferencedFeedback() != null) {
      fbg = feedbackGroupData.getObjectForId(sr.getReferencedFeedback());
    }
    if (fbg == null) {
      fbg = new FeedbackGroup();
    }
    fbg.addFeedbacksMinusDuplicates(sr.getFeedbacks());
    sr.setReferencedFeedback(fbg.getId());

    if (StringUtils.isBlank(sr.getName())) {
      sr.setName(generateServiceRequestName(sr));
    }

    sr.setTargetId(((IdentifiableObject) sr.getTarget()).getId());

    if (sr.getCompletionDate() == null) {
      sr.setCompletionDate(Helpers.DUMMY_TIME);
    }
  }

  private String generateServiceRequestName(ServiceRequest sr) {
    StringBuilder name = new StringBuilder();
    switch (sr.getServiceType()) {
      case MAINTENANCE:
        name.append("Maintenance of ");
      case CLEANING:
        name.append("Cleaning of ");
    }
    if (sr.getTarget() instanceof Stop) {
      name.append("Stop ").append(((Stop) sr.getTarget()).getCommonName()).append(" (")
          .append(sr.getId()).append(")");
    } else if (sr.getTarget() instanceof Vehicle) {
      name.append("Vehicle ").append(((Vehicle) sr.getTarget()).getId());
    }
    return name.toString();
  }
}
