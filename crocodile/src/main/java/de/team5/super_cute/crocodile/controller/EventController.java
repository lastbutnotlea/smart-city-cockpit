package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;
import static de.team5.super_cute.crocodile.config.C4CConfig.EVENT_TEST_LOCATION_NAME;

import de.team5.super_cute.crocodile.config.C4CConfig;
import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
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

    return connector.getEvents().stream()
        // filter out events created by unit tests
        .filter(e -> !e.getLocationName().equals(EVENT_TEST_LOCATION_NAME))
        .peek(this::prepareEventForFrontend)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Event getEvent(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request for Event with id " + id);

    Event event = (Event) connector.getC4CEntityById(new Event(), id);
    prepareEventForFrontend(event);
    return event;
  }

  @PostMapping
  public Event addEvent(@RequestBody Event eventInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to add Event: " + eventInput);

    handleEventFromFrontend(eventInput);
    String objectId = connector.putC4CEntity(eventInput);
    Event eventWithObjectId = (Event) connector.getC4CEntityByObjectId(new Event(), objectId);
    prepareEventForFrontend(eventWithObjectId);
    return eventWithObjectId;
  }

  @DeleteMapping("/{id}")
  public String deleteEvent(@PathVariable String id)
      throws IOException, EdmException, EntityProviderException {
    logger.info("Got Request to delete Event with id " + id);

    return Helpers.makeIdToJSON(
        connector.deleteC4CEntity(connector.getC4CEntityById(new Event(), id)));
  }

  @PutMapping
  public Event editEvent(@RequestBody Event eventInput)
      throws IOException, BatchException, EdmException, EntityProviderException {
    logger.info("Got Request to edit Event: " + eventInput);

    handleEventFromFrontend(eventInput);
    connector.patchC4CEntity(eventInput);
    prepareEventForFrontend(eventInput);
    return eventInput;
  }

  @GetMapping("/people")
  public List<String> getPeople() {
    logger.info("Got Request to return all possible Appointment Involved Parties");
    return new ArrayList<>(C4CConfig.PARTY_NAME_TO_ID.keySet());
  }

  private void handleEventFromFrontend(Event e) {
    e.getAppointmentNotes()
        .forEach(note -> note.setTypeCode(EC4CNotesTypeCode.APPOINTMENT_NOTES.toString()));
  }

  private void prepareEventForFrontend(Event e) {
    e.setAppointmentInvolvedParties(e.getAppointmentInvolvedParties().stream()
        // only keep the parties important to us
        .filter(aip -> C4CConfig.PARTY_NAME_TO_ID.keySet().contains(aip.getPartyName()))
        .collect(Collectors.toList()));
  }
}
