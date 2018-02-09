package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.model.Feedback;
import java.util.List;
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

  @Autowired
  public FeedbackController(FeedbackData feedbackBaseData) {
    data = feedbackBaseData;
  }

  @GetMapping
  public List<Feedback> getAllFeedbacks() {
    logger.info("Got Request to return all feedbacks");
    return data.getData();
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<Feedback> getVehicleFeedbacks(@PathVariable String vehicleId) {
    logger.info("Got Request to return all feedbacks for vehicle with id " + vehicleId);
    return ((FeedbackData) data).getFeedbackForObjectiveId(vehicleId);
  }

  @GetMapping("/stop/{stopId}")
  public List<Feedback> getStopFeedbacks(@PathVariable String stopId) {
    logger.info("Got Request to return all feedbacks for stop with id " + stopId);
    return ((FeedbackData) data).getFeedbackForObjectiveId(stopId);
  }

  @PutMapping("/{feedbackId}/process")
  public String processFeedback(@PathVariable String feedbackId) {
    logger.info("Got Request to process feedback with id " + feedbackId);
    return ((FeedbackData) data).processFeedback(feedbackId, true);
  }

  @PutMapping("/{feedbackId}/unprocess")
  public String unprocessFeedback(@PathVariable String feedbackId) {
    logger.info("Got Request to UNprocess feedback with id " + feedbackId);
    return ((FeedbackData) data).processFeedback(feedbackId, false);
  }
}
