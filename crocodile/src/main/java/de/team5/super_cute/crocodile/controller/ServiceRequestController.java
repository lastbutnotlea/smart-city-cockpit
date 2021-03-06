package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.FeedbackGroupData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.ServiceOrFeedbackTargetObject;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import de.team5.super_cute.crocodile.model.c4c.FeedbackGroup;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
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

  private List<ServiceRequest> cache;
  private boolean isCached = false;

  @Autowired
  public ServiceRequestController(SAPC4CConnector connector,
      FeedbackGroupData feedbackGroupData, VehicleData vehicleData,
      StopData stopData, FeedbackData feedbackData) {
    this.connector = connector;
    this.feedbackGroupData = feedbackGroupData;
    this.vehicleData = vehicleData;
    this.stopData = stopData;
    this.feedbackData = feedbackData;
    this.cache = new ArrayList<>();
  }

  @GetMapping
  public List<ServiceRequest> getAllServiceRequests()
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for all Service Requests");
    List<ServiceRequest> serviceRequests = connector.getServiceRequests();
    serviceRequests.forEach(this::prepareServiceRequestForFrontend);

    cache.clear();
    cache.addAll(serviceRequests);
    isCached = true;

    return serviceRequests;
  }

  @GetMapping("/{id}")
  public ServiceRequest getServiceRequest(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Service Request with id " + id);
    ServiceRequest serviceRequest = (ServiceRequest) connector
        .getC4CEntityById(new ServiceRequest(), id);
    prepareServiceRequestForFrontend(serviceRequest);
    return serviceRequest;
  }

  @PostMapping
  public ServiceRequest addServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to add Service Request: " + serviceRequestInput);
    handleServiceRequestFromFrontend(serviceRequestInput);

    cache.remove(serviceRequestInput);

    String objectId = connector.putC4CEntity(serviceRequestInput);
    ServiceRequest serviceRequest = (ServiceRequest) connector
        .getC4CEntityByObjectId(new ServiceRequest(), objectId);
    prepareServiceRequestForFrontend(serviceRequest);

    cache.add(serviceRequest);

    return serviceRequest;
  }

  @DeleteMapping("/{id}")
  public String deleteServiceRequest(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request to delete Service Request with id " + id);

    cache.removeIf(sr -> sr.getId().equals(id));

    return connector.deleteC4CEntity(connector.getC4CEntityById(new ServiceRequest(), id));
  }

  @PutMapping
  public ServiceRequest editServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to edit Service Request: " + serviceRequestInput);
    handleServiceRequestFromFrontend(serviceRequestInput);

    cache.removeIf(sr -> sr.getId().equals(serviceRequestInput.getId()));
    cache.add(serviceRequestInput);

    connector.patchC4CEntity(serviceRequestInput, true);
    return serviceRequestInput;
  }

  private List<ServiceRequest> getCache(Predicate<ServiceRequest> predicate)
      throws EntityProviderException, EdmException, IOException {
    if (isCached) {
      return cache.stream().filter(predicate).collect(Collectors.toList());
    } else {
      return getAllServiceRequests().stream().filter(predicate).collect(Collectors.toList());
    }
  }

  @GetMapping("/stop/{stopId}")
  public List<ServiceRequest> getAllServiceRequestsForStop(@PathVariable String stopId)
      throws IOException, EdmException, EntityProviderException {
    return getCache(sr -> sr.getTarget() instanceof Stop
        && ((Stop) sr.getTarget()).getId().equals(stopId));
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<ServiceRequest> getAllServiceRequestsForVehicle(@PathVariable String vehicleId)
      throws IOException, EdmException, EntityProviderException {
    return getCache(sr -> sr.getTarget() instanceof Vehicle
        && ((Vehicle) sr.getTarget()).getId().equals(vehicleId));
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
      feedbackGroupData.addObject(fbg);
    }
    for (Feedback f : fbg.getFeedbacks()) {
      feedbackData.processFeedback(f.getId(), false);
    }
    fbg.getFeedbacks().clear();
    for (Feedback f : sr.getFeedbacks()) {
      fbg.addFeedback(f);
      feedbackData.processFeedback(f.getId(), true);
    }
    sr.setReferencedFeedback(fbg.getId());

    if (StringUtils.isBlank(sr.getName())) {
      sr.setName(generateServiceRequestName(sr));
    }

    if (StringUtils.isBlank(sr.getServiceRequestDescription().get(0).getText())) {
      sr.getServiceRequestDescription().get(0).setText(generateServiceRequestName(sr));
    }

    sr.setTargetId(((IdentifiableObject) sr.getTarget()).getId());

    if (sr.getCompletionDate() == null) {
      sr.setCompletionDate(Helpers.DUMMY_TIME);
    }

    sr.getServiceRequestDescription()
        .forEach(description -> description.setTypeCode(EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION.toString()));
  }

  private String generateServiceRequestName(ServiceRequest sr) {
    StringBuilder name = new StringBuilder();
    switch (sr.getServiceType()) {
      case MAINTENANCE:
        name.append("Maintenance of ");
        break;
      case CLEANING:
        name.append("Cleaning of ");
        break;
    }
    if (sr.getTarget() instanceof Stop) {
      name.append("Stop ").append(((Stop) sr.getTarget()).getCommonName()).append(" (")
          .append(((Stop) sr.getTarget()).getId()).append(")");
    } else if (sr.getTarget() instanceof Vehicle) {
      name.append(((Vehicle) sr.getTarget()).getId());
    }
    return name.toString();
  }
}
