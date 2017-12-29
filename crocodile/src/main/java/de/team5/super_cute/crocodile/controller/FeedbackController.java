package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feedback")
public class FeedbackController extends BaseController<Feedback> {

    @Autowired
    public FeedbackController(BaseData<Feedback> feedbackBaseData) {
        data = feedbackBaseData;
    }

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return data.getData();
    }

    @GetMapping("/{vehicleId}")
    public List<Feedback> getVehicleFeedbacks(@PathVariable String vehicleId) {
        return data.getData().stream().filter(f -> f.getFeedbackType() == EFeedbackType.VEHICLE_FEEDBACK).filter(f -> ((Vehicle)f.getObjective()).getId() == vehicleId).collect(Collectors.toList());
    }

    @GetMapping("/{stopId}")
    public List<Feedback> getStopFeedbacks(@PathVariable String stopId) {
        return data.getData().stream().filter(f -> f.getFeedbackType() == EFeedbackType.STOP_FEEDBACK).filter(f -> ((Stop)f.getObjective()).getId() == stopId).collect(Collectors.toList());
    }

    @GetMapping("/{lineId}")
    public List<Feedback> getLineFeedbacks(@PathVariable String lineId) {
        return data.getData().stream().filter(f -> f.getFeedbackType() == EFeedbackType.LINE_FEEDBACK).filter(f -> ((Line)f.getObjective()).getId() == lineId).collect(Collectors.toList());
    }
}
