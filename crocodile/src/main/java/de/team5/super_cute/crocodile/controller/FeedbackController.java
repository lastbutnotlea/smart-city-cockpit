package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.util.Helpers.makeIdToJSON;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.EFeedbackType;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/feedback")
public class FeedbackController extends BaseController<Feedback> {

  private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

  private ArrayList<String> processedFeedback;

  @Autowired
  public FeedbackController(BaseData<Feedback> feedbackBaseData) {
    data = feedbackBaseData;
    processedFeedback = new ArrayList<>();
  }

  @GetMapping
  public List<Feedback> getAllFeedbacks() {
    logger.info("Got Request to return all feedbacks");
    return data.getData().stream().peek(this::setProcessed).collect(Collectors.toList());
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<Feedback> getVehicleFeedbacks(@PathVariable String vehicleId) {
    logger.info("Got Request to return all feedbacks for vehicle with id " + vehicleId);
    return data.getData().stream()
        .filter(f -> f.getFeedbackType() == EFeedbackType.VEHICLE_FEEDBACK)
        .filter(f -> ((IdentifiableObject) f.getObjective()).getId().equals(vehicleId))
        .peek(this::setProcessed)
        .collect(Collectors.toList());
  }

  @GetMapping("/stop/{stopId}")
  public List<Feedback> getStopFeedbacks(@PathVariable String stopId) {
    logger.info("Got Request to return all feedbacks for stop with id " + stopId);
    return data.getData().stream()
        .filter(f -> f.getFeedbackType() == EFeedbackType.STOP_FEEDBACK)
        .filter(f -> ((IdentifiableObject) f.getObjective()).getId().equals(stopId))
        .peek(this::setProcessed)
        .collect(Collectors.toList());
  }

  @PutMapping("/{feedbackId}/process")
  public String processFeedback(@PathVariable String feedbackId) {
    logger.info("Got Request to process feedback with id " + feedbackId);
    return processFeedback(feedbackId, true);
  }

  @PutMapping("/{feedbackId}/unprocess")
  public String unprocessFeedback(@PathVariable String feedbackId) {
    logger.info("Got Request to UNprocess feedback with id " + feedbackId);
    return processFeedback(feedbackId, false);
  }

  private String processFeedback(String feedbackId, boolean processed) {
    Feedback feedback = new Feedback(getObjectForId(feedbackId));
    feedback.setProcessed(processed);
    if (processed) {
      processedFeedback.add(feedbackId);
    } else {
      if (processedFeedback.contains(feedbackId)) {
        processedFeedback.remove(feedbackId);
      }
    }
    return makeIdToJSON(feedbackId);
  }

  private void setProcessed(Feedback feedback) {
    if (processedFeedback.contains(feedback.getId())) {
      feedback.setProcessed(true);
    } else {
      feedback.setProcessed(false);
    }
  }
}
