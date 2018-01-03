package de.team5.super_cute.crocodile.generator;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.CREATE_STOP_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.CREATE_VEHICLE_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DEFECT_FEEDBACK_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY_CHANGE_AMPLITUDE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY_MAX;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.DELAY_MIN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD_CHANGE_AMPLITUDE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD_MAX_FACTOR;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.LOAD_MIN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING_CHANGE_AMPLITUDE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING_MAX;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.PEOPLE_WAITING_MIN;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.REMOVE_STOP_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.REMOVE_VEHICLE_DEFECT_PERCENTAGE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECTS_SEVERITY;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.STOP_DEFECT_FEEDBACK;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_CHANGE_AMPLITUDE;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_MAX;
import static de.team5.super_cute.crocodile.config.LiveDataConfig.TEMPERATURE_MIN;
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
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.Feedbackable;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.service.VehiclePositionService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map.Entry;
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
  @Autowired
  private TripData tripData;
  @Autowired
  private VehiclePositionService vehiclePositionService;

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
    if (shouldIChangeThisValue(PEOPLE_WAITING, stop)) {
      stop.setPeopleWaiting(
          getNewValue(stop.getPeopleWaiting(), PEOPLE_WAITING_CHANGE_AMPLITUDE, PEOPLE_WAITING_MIN,
              PEOPLE_WAITING_MAX));
      generateValueFeedback(stop, PEOPLE_WAITING);
    }
    removeDefect(stop, true);
    String defect = generateDefect(stop, true);
    if (defect != null) {
      stop.addDefect(defect);
    }
    stopData.editObject(stop);
  }

  private void generateLiveDataForVehicle(Vehicle vehicle) {
    Random r = new Random(System.currentTimeMillis());
    if (shouldIChangeThisValue(LOAD, vehicle)) {
      vehicle.setLoad(getNewValue(vehicle.getLoad(), LOAD_CHANGE_AMPLITUDE, LOAD_MIN,
          vehicle.getCapacity() * LOAD_MAX_FACTOR));
      generateValueFeedback(vehicle, LOAD);
    }
    if (shouldIChangeThisValue(TEMPERATURE, vehicle)) {
      vehicle.setTemperature(
          getNewValue(vehicle.getTemperature(), TEMPERATURE_CHANGE_AMPLITUDE, TEMPERATURE_MIN,
              TEMPERATURE_MAX));
      generateValueFeedback(vehicle, TEMPERATURE);
    }
    if (shouldIChangeThisValue(DELAY, vehicle)) {
      vehicle
          .setDelay(getNewValue(vehicle.getDelay(), DELAY_CHANGE_AMPLITUDE, DELAY_MIN, DELAY_MAX));
      generateValueFeedback(vehicle, DELAY);
    }
    removeDefect(vehicle, false);
    String defect = generateDefect(vehicle, false);
    if (defect != null) {
      vehicle.addDefect(defect);
    }
    vehicleData.editObject(vehicle);
  }

  private int getNewValue(int oldValue, int changeAmplitude, int min, int max) {
    Random r = new Random(System.currentTimeMillis());
    return max(min(oldValue + (r.nextInt(changeAmplitude * 2) - changeAmplitude), max), min);
  }

  private boolean shouldIChangeThisValue(String fieldName, Stop stop) {
    if (fieldName.equals(PEOPLE_WAITING)) {
      return true; // the number of waiters at a stop can always change
    } else {
      throw new IllegalArgumentException(
          "The field " + fieldName + " is not a field in the class Stop.");
    }
  }

  private boolean shouldIChangeThisValue(String fieldName, Vehicle vehicle) {
    switch (fieldName) {
      case LOAD:
        // only change load if vehicle is currently at a stop
        LocalDateTime now = LocalDateTime.now();
        Trip currentTrip = tripData.getCurrentTripOfVehicle(vehicle, now);
        Entry<String, Boolean> vehicleAtStop = vehiclePositionService
            .getStopForGivenTime(vehicle, currentTrip, now);
        return vehicleAtStop.getValue();
      case TEMPERATURE:
      case DELAY:
        return true;
      default:
        throw new IllegalArgumentException(
            "The field " + fieldName + " is not a field in the class Vehicle.");
    }
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

  private void generateValueFeedback(Feedbackable feedbackable, String fieldName) {
    Random r = new Random(System.currentTimeMillis());
    if (r.nextInt(99) + 1 <= VALUE_FEEDBACK_PERCENTAGE) {
      EState rating = EState.FINE;
      switch (fieldName) {
        case (PEOPLE_WAITING):
          rating = getState(((Stop) feedbackable).getPeopleWaitingSeverity());
          break;
        case (LOAD):
          rating = getState(((Vehicle) feedbackable).getLoadSeverity());
          break;
        case (TEMPERATURE):
          rating = getState(((Vehicle) feedbackable).getTemperatureSeverity());
          break;
        case (DELAY):
          rating = getState(((Vehicle) feedbackable).getDelaySeverity());
          break;
      }
      feedbackData.addObject(getValueFeedbackForField(feedbackable, fieldName, rating, r));
    }
  }

  private Feedback getValueFeedbackForField(Feedbackable objective, String fieldname, EState rating,
      Random random) {
    String message = VALUE_FEEDBACK.get(fieldname).get(rating.ordinal())
        .get(random.nextInt(VALUE_FEEDBACK.get(fieldname).get(rating.ordinal()).size() - 1));
    return new Feedback(message, LocalDateTime.now(), objective, VEHICLE_FEEDBACK, rating);
  }
}

