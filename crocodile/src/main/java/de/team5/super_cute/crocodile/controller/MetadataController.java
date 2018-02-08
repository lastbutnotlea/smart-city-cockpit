package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.jsonclasses.FilterData;
import de.team5.super_cute.crocodile.model.EFeedbackType;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.c4c.EStatusCode;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Supplies various metadata things for the frontend, e.g. enum value ranges.
 */
@RestController
@RequestMapping(API_PREFIX + "/metadata")
public class MetadataController {

  private static final Logger logger = LoggerFactory.getLogger(MetadataController.class);

  private LineData lineData;

  @Autowired
  public MetadataController(LineData lineData) {
    this.lineData = lineData;
  }

  @GetMapping("/feedback-types")
  public List<String> getAllFeedbackTypes() {
    logger.info("Got Request for all feedback types");
    return Arrays.stream(EFeedbackType.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/states")
  public List<String> getAllStates() {
    logger.info("Got Request for all states");
    return Arrays.stream(EState.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/vehicle-types")
  public List<String> getAllVehicleTypes() {
    logger.info("Got Request for all vehicle types");
    return Arrays.stream(EVehicleType.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/lines")
  public List<String> getAllLines() {
    logger.info("Got Request for all lines");
    return lineData.getData().stream().map(Line::getName).collect(Collectors.toList());
  }

  @GetMapping("/status-codes")
  public List<String> getAllStatusCodes() {
    logger.info("Got Request for all status codes");
    return Arrays.stream(EStatusCode.values()).map(EStatusCode::toString)
        .collect(Collectors.toList());
  }

  @GetMapping("/service-types")
  public List<String> getAllServiceTypes() {
    logger.info("Got Request for all service request types");
    return Arrays.stream(EServiceType.values()).map(EServiceType::toString)
        .collect(Collectors.toList());
  }

  @GetMapping("/filter")
  public FilterData getFilterData() {
    logger.info("Got Request for Filter Metadata.");
    FilterData fd = new FilterData();
    fd.lineNames = getAllLines();
    fd.types = getAllVehicleTypes();
    fd.states = getAllStates();
    return fd;
  }
}
