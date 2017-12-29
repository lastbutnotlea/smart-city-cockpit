package de.team5.super_cute.crocodile.generator;

import de.team5.super_cute.crocodile.data.*;
import de.team5.super_cute.crocodile.model.*;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import sun.util.resources.cldr.lag.LocaleNames_lag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import static de.team5.super_cute.crocodile.config.LiveDataConfig.*;
import static de.team5.super_cute.crocodile.model.EFeedbackType.STOP_FEEDBACK;
import static de.team5.super_cute.crocodile.model.EFeedbackType.VEHICLE_FEEDBACK;
import static de.team5.super_cute.crocodile.util.StateCalculator.getState;
import static org.apache.commons.lang3.math.NumberUtils.max;
import static org.apache.commons.lang3.math.NumberUtils.min;

@Service
public class LiveDataGenerator {

    @Autowired
    private StopData stopData;
    @Autowired
    private VehicleData vehicleData;
    @Autowired
    private FeedbackData feedbackData;

    @Scheduled(fixedDelay = 30000)
    public void generateLiveData() {
        LoggerFactory.getLogger(getClass())
                .info("Started generating LiveData");
        List<Stop> stops = stopData.getData();
        List<Vehicle> vehicles = vehicleData.getData();
        for (Stop stop : stops) {
            generateLiveDataForStop(stop);
        }
        for (Vehicle vehicle : vehicles) {
            generateLiveDataForVehicle(vehicle);
        }
        LoggerFactory.getLogger(getClass())
                .info("Finished generating LiveData");
    }

    private void generateLiveDataForStop(Stop stop) {
        Random r = new Random(System.currentTimeMillis());
        //increase or decrease people waiting by 0-5%
        stop.setPeopleWaiting(max(min(stop.getPeopleWaiting() + (r.nextInt(300) - 150), 1000), 0));
        generateValueFeedback(stop, "peopleWaiting");
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
        vehicle.setLoad(max(min((int) (vehicle.getLoad() + (r.nextInt(50) - 25)), vehicle.getCapacity() * 2), 0));
        generateValueFeedback(vehicle, "load");
        vehicle.setTemperature(max(min((int) (vehicle.getTemperature() + (r.nextInt(10) - 5)), 40), 5));
        generateValueFeedback(vehicle, "temperature");
        vehicle.setDelay(max(min((int) (vehicle.getDelay() + (r.nextInt(10) - 5)), 60), -5));
        generateValueFeedback(vehicle, "delay");
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
        if (r.nextInt(99) + 1 <= (forStop ? CREATE_STOP_DEFECT_PERCENTAGE : CREATE_STOP_DEFECT_PERCENTAGE)) {
            defect = (forStop ? STOP_DEFECTS.get(r.nextInt(STOP_DEFECTS.size() - 1)) : VEHICLE_DEFECTS.get(r.nextInt(VEHICLE_DEFECTS.size() - 1)));
            if (r.nextInt(99) + 1 <= DEFECT_FEEDBACK_PERCENTAGE) {
                feedbackData.addObject(new Feedback((
                        forStop ?
                                STOP_DEFECT_FEEDBACK.get(defect).get(r.nextInt(STOP_DEFECT_FEEDBACK.get(defect).size() - 1)) :
                                VEHICLE_DEFECT_FEEDBACK.get(defect).get(r.nextInt(VEHICLE_DEFECT_FEEDBACK.get(defect).size() - 1))),
                        LocalDateTime.now(), feedbackable,
                        forStop ? STOP_FEEDBACK : VEHICLE_FEEDBACK,
                        forStop ? getState(STOP_DEFECTS_SEVERITY.get(defect)) : getState(VEHICLE_DEFECTS_SEVERITY.get(defect))));
            }
        }
        return defect;
    }

    private void removeDefect(Feedbackable feedbackable, boolean forStop){
        if(forStop){
          if(((Stop) feedbackable).getDefects().size() != 0){
              ((Stop) feedbackable).removeDefect(((Stop) feedbackable).getDefects().iterator().next());
          }
        }
        else{
            if(((Vehicle) feedbackable).getDefects().size() != 0){
                ((Vehicle) feedbackable).removeDefect(((Vehicle) feedbackable).getDefects().iterator().next());
            }
        }
    }

    private void generateValueFeedback(Feedbackable feedbackable, String attribute){
        Random r = new Random(System.currentTimeMillis());
        if(r.nextInt(99) + 1 <= VALUE_FEEDBACK_PERCENTAGE){
            String message = "";
            EState rating = null;
            EFeedbackType feedbackType = null;
            int severity;
            Stop stop;
            Vehicle vehicle;
            switch(attribute){
                case("peopleWaiting"):
                    stop = (Stop) feedbackable;
                    if(stop.getPeopleWaiting() <= 300){
                        severity = 0;
                    }
                    else if(stop.getPeopleWaiting() <= 700){
                        severity = 1;
                    }
                    else{
                        severity = 2;
                    }
                    message = VALUE_FEEDBACK.get("peopleWaiting").get(severity).get(r.nextInt(VALUE_FEEDBACK.get("peopleWaiting").get(severity).size() - 1));
                    rating = getState(PEOPLE_WAITING_SEVERITY[severity]);
                    feedbackType = STOP_FEEDBACK;
                    break;
                case("load"):
                    vehicle = (Vehicle) feedbackable;
                    if(vehicle.getLoad() / vehicle.getCapacity() <= 0.5){
                        severity = 0;
                    }
                    else if(vehicle.getLoad() / vehicle.getCapacity() <= 1.5){
                        severity = 1;
                    }
                    else{
                        severity = 2;
                    }
                    message = VALUE_FEEDBACK.get("load").get(severity).get(r.nextInt(VALUE_FEEDBACK.get("load").get(severity).size() - 1));
                    rating = getState(LOAD_SEVERITY[severity]);
                    feedbackType = VEHICLE_FEEDBACK;
                    break;
                case("temperature"):
                    vehicle = (Vehicle) feedbackable;
                    if(vehicle.getTemperature() <= 30 && vehicle.getTemperature() >= 25){
                        severity = 0;
                    }
                    else if((vehicle.getTemperature() <= 24 && vehicle.getTemperature() >= 15) || (vehicle.getTemperature() <= 40 && vehicle.getTemperature() >= 31)){
                        severity = 1;
                    }
                    else{
                        severity = 2;
                    }
                    message = VALUE_FEEDBACK.get("temperature").get(severity).get(r.nextInt(VALUE_FEEDBACK.get("temperature").get(severity).size() - 1));
                    rating = getState(TEMPERATURE_SEVERITY[severity]);
                    feedbackType = VEHICLE_FEEDBACK;
                    break;
                case("delay"):
                    vehicle = (Vehicle) feedbackable;
                    if(vehicle.getDelay() <= 5){
                        severity = 0;
                    }
                    else if(vehicle.getDelay() <= 15){
                        severity = 1;
                    }
                    else{
                        severity = 2;
                    }
                    message = VALUE_FEEDBACK.get("delay").get(severity).get(r.nextInt(VALUE_FEEDBACK.get("delay").get(severity).size() - 1));
                    rating = getState(DELAY_SEVERITY[severity]);
                    feedbackType = VEHICLE_FEEDBACK;
                    break;
            }
            feedbackData.addObject(new Feedback(message, LocalDateTime.now(), feedbackable, feedbackType, rating));
        }
    }
}

