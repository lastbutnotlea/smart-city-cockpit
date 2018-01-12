package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;

import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.Event;
import java.io.IOException;
import java.util.ArrayList;
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
@RequestMapping(API_PREFIX + "/events")
public class EventController {

  private static final Logger logger = LoggerFactory.getLogger(EventController.class);

  private SAPC4CConnector connector;

  @Autowired
  public EventController(SAPC4CConnector connector) {
    this.connector = connector;
  }

  @GetMapping
  public List<Event> getAllEvents()
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for all Events");
    List<Event> events = connector.getEvents();
    return events;
  }

  @GetMapping("/{id}")
  public Event getAllEvents(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Event with id " + id);
    Event event = connector.getEvents().stream()
        .filter(sr -> sr.getId().equals(id)).findAny()
        .orElseThrow(() -> new IllegalArgumentException("No Event found for this id."));
    return event;
  }

  @PostMapping
  public String addEvent(@RequestBody Event eventInput)
      throws IOException, BatchException {
    logger.info("Got Request to add Event: " + eventInput);
    connector.putC4CEntity(eventInput);
    return eventInput.getId();
  }

  @DeleteMapping("/{id}")
  public String deleteEvent(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request to delete Event with id " + id);
   return connector.deleteC4CEntity(
        connector.getEvents().stream().filter(sr -> sr.getId().equals(id)).findAny()
            .orElseThrow(() -> new IllegalArgumentException(
                "No Event found for the given id: " + id)));
  }

  @PutMapping
  public String editEvent(@RequestBody Event eventInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to edit Event: " + eventInput);
  connector.deleteC4CEntity(eventInput);
    connector.putC4CEntity(eventInput);
    return eventInput.getId();
  }

  @GetMapping("/people")
  public List<String> getPeople() {
    return new ArrayList<String>() {{
      add("Fußballverein");
      add("Opernunternehmen");
      add("Asoziales Netzwerk");
      add("Zentrum für Anti-Terror-Anschläge");
    }};
  }
}
