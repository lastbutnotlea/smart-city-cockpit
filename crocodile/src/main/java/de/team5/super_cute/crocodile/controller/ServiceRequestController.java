package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.FeedbackGroupData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import de.team5.super_cute.crocodile.model.c4c.FeedbackGroup;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import javax.transaction.Transactional;
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

  @Autowired
  public ServiceRequestController(SAPC4CConnector connector,
      FeedbackGroupData feedbackGroupData, VehicleData vehicleData,
      StopData stopData, FeedbackData feedbackData) {
    this.connector = connector;
    this.feedbackGroupData = feedbackGroupData;
    this.vehicleData = vehicleData;
    this.stopData = stopData;
    this.feedbackData = feedbackData;
  }

  @GetMapping
  public List<ServiceRequest> getAllServiceRequests()
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for all Service Requests");
    //List<ServiceRequest> serviceRequests = connector.getServiceRequests();

    List<ServiceRequest> serviceRequests = new ArrayList<>();
    List<Vehicle> vs = vehicleData.getData();
    Vehicle v = null;
    if (vs == null || vs.size() < 1) {
      //int capacity, int load, int delay, int temperature, EVehicleType type,
      //      Set<String> defects
      v = new Vehicle(5, 2, 0, 28, EVehicleType.SUBWAY, new HashSet<String>() {{
        add(LiveDataConfig.VEHICLE_ENGINE_FAILURE);
      }});
      vehicleData.addObject(v);
    } else {
      v = vs.get(0);
    }
    serviceRequests.add(Helpers.generateTestServiceRequest(v));
    FeedbackGroup fb = new FeedbackGroup();
    fb.setFeedbacks(new HashSet<>(feedbackData.getData().subList(0, Math.min(5, feedbackData.getData().size()))));
    feedbackGroupData.addObject(fb);
    serviceRequests.get(0).setReferencedFeedback(fb.getId());

    serviceRequests.forEach(this::prepareServiceRequestForFrontend);
    return serviceRequests;
  }

  @GetMapping("/{id}")
  public ServiceRequest getAllServiceRequests(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Service Request with id " + id);
    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
    }};
    //vehicleData.addObject(new Vehicle())
    ServiceRequest srr = new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(),
        EState.FINE, LocalDateTime
        .now().plusDays(5),
        EServiceType.MAINTENANCE, notes, "Vehicle_0", "Feedback_0");
    return srr;
//    ServiceRequest serviceRequest = connector.getServiceRequests().stream()
//        .filter(sr -> sr.getId().equals(id)).findAny()
//        .orElseThrow(() -> new IllegalArgumentException("No Service Request found for this id."));
//    prepareServiceRequestForFrontend(serviceRequest);
//    return serviceRequest;
  }

  @PostMapping
  public String addServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException {
    logger.info("Got Request to add Service Request: " + serviceRequestInput);
    if (serviceRequestInput.getId() == null) {
      serviceRequestInput.setId();
    }
    connector.putC4CEntity(serviceRequestInput);
    return serviceRequestInput.getId();
  }

  @DeleteMapping("/{id}")
  public String deleteServiceRequest(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request to delete Service Request with id " + id);
    return connector.deleteC4CEntity(
        connector.getServiceRequests().stream().filter(sr -> sr.getId().equals(id)).findAny()
            .orElseThrow(() -> new IllegalArgumentException(
                "No Service Request found for the given id: " + id)));
  }

  @PutMapping
  public String editServiceRequest(@RequestBody ServiceRequest serviceRequestInput)
      throws IOException, BatchException {
    logger.info("Got Request to edit Service Request: " + serviceRequestInput);
    connector.deleteC4CEntity(serviceRequestInput);
    connector.putC4CEntity(serviceRequestInput);
    return serviceRequestInput.getId();
  }

  private void prepareServiceRequestForFrontend(ServiceRequest sr) {
    FeedbackGroup feedbackGroup = feedbackGroupData.getObjectForId(sr.getReferencedFeedback());
    if (feedbackGroup != null) {
      sr.setFeedbacks(feedbackGroup.getFeedbacks());
    } else {
      sr.setFeedbacks(new HashSet<>());
    }
    IdentifiableObject target = getTargetObject(sr);
    if (target != null) {
      sr.setTarget(target);
    }
  }

  private IdentifiableObject getTargetObject(ServiceRequest sr) {
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
    // todo check for feedback id, null -> create feedback group + save id
    // todo auto generate name
    // todo
  }
}
