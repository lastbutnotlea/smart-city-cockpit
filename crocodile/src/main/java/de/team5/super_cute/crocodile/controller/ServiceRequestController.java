package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import java.io.IOException;
import java.util.List;
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
@RequestMapping("/servicerequests")
public class ServiceRequestController {

  private static final Logger logger = LoggerFactory.getLogger(ServiceRequestController.class);

  private SAPC4CConnector connector;

  @Autowired
  public ServiceRequestController(SAPC4CConnector connector) {
    this.connector = connector;
  }

  @GetMapping
  public List<ServiceRequest> getAllServiceRequests()
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for all Service Requests");
    return connector.getServiceRequests();
  }

  @GetMapping("/{id}")
  public ServiceRequest getAllServiceRequests(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Service Request with id " + id);
    return connector.getServiceRequests().stream().filter(sr -> sr.getId().equals(id)).findAny()
        .orElseThrow(() -> new IllegalArgumentException("No Service Request found for this id."));
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
}
