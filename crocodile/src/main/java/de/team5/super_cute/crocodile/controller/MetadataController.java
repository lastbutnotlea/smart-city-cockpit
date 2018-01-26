package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.LineData;
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
    return Arrays.stream(EFeedbackType.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/states")
  public List<String> getAllStates() {
    return Arrays.stream(EState.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/vehicle-types")
  public List<String> getAllVehicleTypes() {
    return Arrays.stream(EVehicleType.values()).map(Enum::toString).collect(Collectors.toList());
  }

  @GetMapping("/lines")
  public List<String> getAllLines() {
    return lineData.getData().stream().map(Line::getName).collect(Collectors.toList());
  }

  @GetMapping("/status-codes")
  public List<String> getAllStatusCodes() {
    return Arrays.stream(EStatusCode.values()).map(EStatusCode::toString)
        .collect(Collectors.toList());
  }

  @GetMapping("/service-types")
  public List<String> getAllServiceTypes() {
    return Arrays.stream(EServiceType.values()).map(EServiceType::toString)
        .collect(Collectors.toList());
  }

  @GetMapping("/filter")
  public FilterData getFilterData() {
    logger.info("Got Request for Filter Metadata.");
    FilterData fd = new FilterData();
    fd.lines = getAllLines();
    fd.vehicleTypes = getAllVehicleTypes();
    fd.states = getAllStates();
    return fd;
  }

  private class FilterData {

    @JsonProperty
    List<String> lines;
    @JsonProperty
    List<String> vehicleTypes;
    @JsonProperty
    List<String> states;
  }
}
