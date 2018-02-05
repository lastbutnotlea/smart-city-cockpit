package de.team5.super_cute.crocodile.validation;

import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.model.Trip;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleValidation {

  private TripData tripData;

  @Autowired
  public VehicleValidation(TripData tripData) {
    this.tripData = tripData;
  }

  public boolean checkVehicleAvailability(Trip trip) {
    //get trips for this trips vehicle
    List<Trip> trips = tripData.getData().stream()
        .filter(t -> t.getVehicle().getId().equals(trip.getVehicle().getId())).collect(
            Collectors.toList());
    if (trips.size() == 0) {
      return true;
    }
    //if there is a trip with start or end between this trips start and end then return false
    return trips.stream()
        .noneMatch(t -> ((((t.getStops().values().stream()
            .max(LocalDateTime::compareTo).orElse(null)
            .isAfter(trip.getStops().values().stream()
                .min(LocalDateTime::compareTo).orElse(null))) &&
            (t.getStops().values().stream()
                .max(LocalDateTime::compareTo).orElse(null)
                .isBefore(trip.getStops().values().stream()
                    .max(LocalDateTime::compareTo).orElse(null)))) ||
            ((t.getStops().values().stream()
                .min(LocalDateTime::compareTo).orElse(null)
                .isBefore(trip.getStops().values().stream()
                    .max(LocalDateTime::compareTo).orElse(null))) &&
                (t.getStops().values().stream()
                    .min(LocalDateTime::compareTo).orElse(null)
                    .isAfter(trip.getStops().values().stream()
                        .min(LocalDateTime::compareTo).orElse(null)))))));
  }
}
