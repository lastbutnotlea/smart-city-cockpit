package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.Helpers;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trips")
public class TripController extends BaseController<Trip> {

  @Autowired
  public TripController(BaseData<Trip> tripData) {
    data = tripData;
  }

  @GetMapping
  public List<Trip> getAllTrips(@RequestParam(defaultValue = "") String vehicleId,
      @RequestParam(defaultValue = "") String lineId,
      @RequestParam(defaultValue = "") String stopId) {
    return data.getData().stream()
        .filter(t -> StringUtils.isEmpty(lineId) || t.getLine().getId().equals(lineId))
        .filter(t -> StringUtils.isEmpty(stopId) || t.getStops().get(stopId) != null)
        .filter(t -> StringUtils.isEmpty(vehicleId) || t.getVehicle().getId().equals(vehicleId))
        .collect(
            Collectors.toList());
  }

  @GetMapping("/{id}")
  public Trip getTrip(@PathVariable String id) {
    return getObjectForId(id);
  }

  @PostMapping
  public ResponseEntity addTrip(@RequestBody Trip tripInput) {
    insertCorrectTimesForTrip(tripInput);
    return addObject(tripInput);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity deleteTrip(@PathVariable String id) {
    return deleteObject(id);
  }

  @PutMapping
  public ResponseEntity editTrip(@RequestBody Trip tripInput) {
    insertCorrectTimesForTrip(tripInput);
    return editObject(tripInput);
  }

  /**
   * Sets the correct times for each stop that has the dummy time associated.
   * At least one Stop has to have a useful time!
   *
   * @param tripInput Trip with some dummy values
   * @return Trip with all dummy values replaced by correct ones
   */
  private void insertCorrectTimesForTrip(Trip tripInput) {
    // Filter out Stops with dummy value + find stop in the trip with a specified time
    String firstStopIdOfTrip = tripInput.getStops().entrySet().stream()
        .filter(e -> !e.getValue().equals(Helpers.DUMMY_TIME))
        .map(Entry::getKey).findAny()
        .orElseThrow(() -> new IllegalArgumentException(
            "No Stop in trip that has something else than a dummy time"));
    LocalDateTime departureAtFirstStopOfTrip = tripInput.getStops().get(firstStopIdOfTrip);

    // Find offset from first stop to line start
    Map<String, Integer> travelTime;
    travelTime = tripInput.isInbound() ? tripInput.getLine().getTravelTimeInbound()
        : tripInput.getLine().getTravelTimeOutbound();

    int tripToLineOffset = travelTime.get(firstStopIdOfTrip);
    List<String> stopIdsThatNeedCorrectTime = tripInput.getStops().entrySet().stream()
        .filter(e -> e.getValue().equals(Helpers.DUMMY_TIME))
        .map(Entry::getKey)
        .collect(Collectors.toList());

    for (String stopId : stopIdsThatNeedCorrectTime) {
      int travelTimeFromStartToStop = travelTime.get(stopId);
      LocalDateTime correctTime = departureAtFirstStopOfTrip.minusMinutes(tripToLineOffset)
          .plusMinutes(travelTimeFromStartToStop);
      tripInput.getStops().put(stopId, correctTime);
    }
  }
}
