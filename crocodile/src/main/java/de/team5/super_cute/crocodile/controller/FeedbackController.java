package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.EFeedbackType;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/feedback")
public class FeedbackController extends BaseController<Feedback> {

  @Autowired
  public FeedbackController(BaseData<Feedback> feedbackBaseData) {
    data = feedbackBaseData;
  }

  @GetMapping
  public List<Feedback> getAllFeedbacks() {
    return data.getData();
  }

  @GetMapping("/vehicle/{vehicleId}")
  public List<Feedback> getVehicleFeedbacks(@PathVariable String vehicleId) {
    return data.getData().stream()
        .filter(f -> f.getFeedbackType() == EFeedbackType.VEHICLE_FEEDBACK)
        .filter(f -> ((IdentifiableObject) f.getObjective()).getId().equals(vehicleId))
        .collect(Collectors.toList());
  }

  @GetMapping("/stop/{stopId}")
  public List<Feedback> getStopFeedbacks(@PathVariable String stopId) {
    return data.getData().stream().filter(f -> f.getFeedbackType() == EFeedbackType.STOP_FEEDBACK)
        .filter(f -> ((IdentifiableObject) f.getObjective()).getId().equals(stopId)).collect(Collectors.toList());
  }

  @PutMapping("/{feedbackId}/process")
  public String processFeedback(@PathVariable String feedbackId) {
    return processFeedback(feedbackId, true);
  }

  @PutMapping("/{feedbackId}/unprocess")
  public String unprocessFeedback(@PathVariable String feedbackId) {
    return processFeedback(feedbackId, false);
  }

  private String processFeedback(String feedbackId, boolean processed) {
    Feedback feedback = getObjectForId(feedbackId);
    feedback.setProcessed(processed);
    return makeIdToJSON(feedbackId);
  }
}
