package de.team5.super_cute.crocodile.generator;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.CREATE_STOP_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.CREATE_VEHICLE_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DEFECT_FEEDBACK_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.REMOVE_STOP_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.REMOVE_VEHICLE_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECT_FEEDBACK;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VALUE_FEEDBACK;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VALUE_FEEDBACK_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_DEFECTS;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.VEHICLE_DEFECT_FEEDBACK;
import static de.team5.super_cute.crocodile.model.EFeedbackType.STOP_FEEDBACK;
import static de.team5.super_cute.crocodile.model.EFeedbackType.VEHICLE_FEEDBACK;
import static de.team5.super_cute.crocodile.util.StateCalculator.getState;
import static org.apache.commons.lang3.math.NumberUtils.max;
import static org.apache.commons.lang3.math.NumberUtils.min;

import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.EFeedbackType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.Feedbackable;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class LiveDataGenerator {

  @Autowired
  private StopData stopData;
  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private FeedbackData feedbackData;

  @Scheduled(fixedDelay = 10000)
  public void generateLiveData() {
    LoggerFactory.getLogger(getClass())
        .debug("Started generating LiveData");
    List<Stop> stops = stopData.getData();
    List<Vehicle> vehicles = vehicleData.getData();
    for (Stop stop : stops) {
      generateLiveDataForStop(stop);
    }
    for (Vehicle vehicle : vehicles) {
      generateLiveDataForVehicle(vehicle);
    }
    LoggerFactory.getLogger(getClass())
        .debug("Finished generating LiveData");
  }

  private void generateLiveDataForStop(Stop stop) {
    Random r = new Random(System.currentTimeMillis());
    //increase or decrease people waiting by 0-5%
    stop.setPeopleWaiting(max(min(stop.getPeopleWaiting() + (r.nextInt(300) - 150), 1000), 0));
    generateValueFeedback(stop, PEOPLE_WAITING);
    removeDefect(stop, true);
    String defect = generateDefect(stop, true);
    if (defect != null) {
      stop.addDefect(defect);
    }
    stopData.editObject(stop);
  }

  private void generateLiveDataForVehicle(Vehicle vehicle) {
    Random r = new Random(System.currentTimeMillis());
    //increase or decrease values by 0-5%
    vehicle.setLoad(
        max(min((int) (vehicle.getLoad() + (r.nextInt(50) - 25)), vehicle.getCapacity() * 2), 0));
    generateValueFeedback(vehicle, LOAD);
    vehicle.setTemperature(max(min((int) (vehicle.getTemperature() + (r.nextInt(10) - 5)), 40), 5));
    generateValueFeedback(vehicle, TEMPERATURE);
    vehicle.setDelay(max(min((int) (vehicle.getDelay() + (r.nextInt(10) - 5)), 60), -5));
    generateValueFeedback(vehicle, DELAY);
    removeDefect(vehicle, false);
    String defect = generateDefect(vehicle, false);
    if (defect != null) {
      vehicle.addDefect(defect);
    }
    vehicleData.editObject(vehicle);
  }

  private String generateDefect(Feedbackable feedbackable, boolean forStop) {
    Random r = new Random(System.currentTimeMillis());
    String defect = null;
    if (r.nextInt(99) + 1 <= (forStop ? CREATE_STOP_DEFECT_PERCENTAGE
        : CREATE_VEHICLE_DEFECT_PERCENTAGE)) {
      defect = (forStop ? STOP_DEFECTS.get(r.nextInt(STOP_DEFECTS.size() - 1))
          : VEHICLE_DEFECTS.get(r.nextInt(VEHICLE_DEFECTS.size() - 1)));
      if (r.nextInt(99) + 1 <= DEFECT_FEEDBACK_PERCENTAGE) {
        feedbackData.addObject(new Feedback((
            forStop ?
                STOP_DEFECT_FEEDBACK.get(defect)
                    .get(r.nextInt(STOP_DEFECT_FEEDBACK.get(defect).size() - 1)) :
                VEHICLE_DEFECT_FEEDBACK.get(defect)
                    .get(r.nextInt(VEHICLE_DEFECT_FEEDBACK.get(defect).size() - 1))),
            LocalDateTime.now(), feedbackable,
            forStop ? STOP_FEEDBACK : VEHICLE_FEEDBACK,
            forStop ? getState(STOP_DEFECTS_SEVERITY.get(defect))
                : getState(VEHICLE_DEFECTS_SEVERITY.get(defect))));
      }
    }
    return defect;
  }

  private void removeDefect(Feedbackable feedbackable, boolean forStop) {
    Random r = new Random(System.currentTimeMillis());
    if (forStop) {
      if (((Stop) feedbackable).getDefects().size() != 0) {
        if (r.nextInt(99) + 1 <= REMOVE_STOP_DEFECT_PERCENTAGE) {
          ((Stop) feedbackable).removeDefect(((Stop) feedbackable).getDefects().iterator().next());
        }
      }
    } else {
      if (((Vehicle) feedbackable).getDefects().size() != 0) {
        if (r.nextInt(99) + 1 <= REMOVE_VEHICLE_DEFECT_PERCENTAGE) {
          ((Vehicle) feedbackable)
              .removeDefect(((Vehicle) feedbackable).getDefects().iterator().next());
        }
      }
    }
  }

  private void generateValueFeedback(Feedbackable feedbackable, int fieldName) {
    Random r = new Random(System.currentTimeMillis());
    if (r.nextInt(99) + 1 <= VALUE_FEEDBACK_PERCENTAGE) {
      EState rating;
      switch (fieldName) {
        case (PEOPLE_WAITING):
          rating = getState(((Stop) feedbackable).getPeopleWaitingSeverity());
          feedbackData
              .addObject(getValueFeedbackForField(feedbackable, PEOPLE_WAITING, rating, r));
          break;
        case (LOAD):
          rating = getState(((Vehicle) feedbackable).getLoadSeverity());
          feedbackData.addObject(getValueFeedbackForField(feedbackable, LOAD, rating, r));
          break;
        case (TEMPERATURE):
          rating = getState(((Vehicle) feedbackable).getTemperatureSeverity());
          feedbackData.addObject(getValueFeedbackForField(feedbackable, TEMPERATURE, rating, r));
          break;
        case (DELAY):
          rating = getState(((Vehicle) feedbackable).getDelaySeverity());
          feedbackData.addObject(getValueFeedbackForField(feedbackable, DELAY, rating, r));
          break;
      }
    }
  }

  private Feedback getValueFeedbackForField(Feedbackable objective, int fieldname, EState rating,
      Random random) {
    String message = VALUE_FEEDBACK.get(fieldname).get(rating.ordinal())
        .get(random.nextInt(VALUE_FEEDBACK.get(fieldname).get(rating.ordinal()).size() - 1));
    EFeedbackType feedbackType = VEHICLE_FEEDBACK;
    return new Feedback(message, LocalDateTime.now(), objective, feedbackType, rating);
  }
}

