package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.Trip;
import java.util.List;
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

  private final TripData tripData;

  @Autowired
  public TripController(TripData tripData) {
    this.tripData = tripData;
  }

  @GetMapping
  public List<Trip> getAllTrips(@RequestParam(defaultValue = "") String vehicleId,
      @RequestParam(defaultValue = "") String lineId,
      @RequestParam(defaultValue = "") String stopId) {
    return tripData.getData().stream()
        .filter(t -> StringUtils.isEmpty(lineId) || t.getLine().getId().equals(lineId))
        .filter(t -> StringUtils.isEmpty(stopId) || t.getStops().get(stopId) != null)
        .filter(t -> StringUtils.isEmpty(vehicleId) || t.getVehicle().getId().equals(vehicleId))
        .collect(
            Collectors.toList());
  }

  @GetMapping("/{id}")
  public Trip getTrip(@PathVariable String id) {
    return getObjectForId(tripData, id);
  }

  @PostMapping
  public ResponseEntity addTrip(@RequestBody Trip tripInput) {
    return addObject(tripData, tripInput);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity deleteTrip(@PathVariable String id) {
    return deleteObject(tripData, id);
  }

  @PutMapping
  public ResponseEntity editTrip(@RequestBody Trip tripInput) {
    return editObject(tripData, tripInput);
  }
}
