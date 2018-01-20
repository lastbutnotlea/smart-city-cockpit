package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.jsonclasses.LineForStopData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.SkipStop;
import de.team5.super_cute.crocodile.model.Stop;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/stops")
public class StopController extends BaseController<Stop> {

  private LineData lineData;
  private TripData tripData;

  @Autowired
  public StopController(BaseData<Stop> stopData, LineData lineData, TripData tripData) {
    data = stopData;
    this.lineData = lineData;
    this.tripData = tripData;
  }

  @GetMapping
  public List<Stop> getAllStops() {
    return data.getData();
  }

  @GetMapping("/{id}")
  public Stop getStop(@PathVariable String id) {
    return getObjectForId(id);
  }

  @GetMapping("/{id}/lines")
  public List<LineForStopData> getLinesForStop(@PathVariable String id) {
    List <Line> lines = lineData.getData();
    List<LineForStopData> lineForStopData = new ArrayList<>();
    for (Line line:lines) {
      if(line.getStopsInbound().stream().anyMatch(s -> s.getId().equals(id))){
        lineForStopData.add(new LineForStopData(true, line.getName()));
      }
      if(line.getStopsOutbound().stream().anyMatch(s -> s.getId().equals(id))){
        lineForStopData.add(new LineForStopData(false, line.getName()));
      }
    }
    return lineForStopData;
  }

  @PostMapping("/skip")
  public SkipStop skipStop(SkipStop skipStop) {
    Stop stop = getObjectForId(skipStop.getStopId());
    tripData.skipStopsInTimeFrameForAllTrips(skipStop.getStopId(), skipStop.getFrom(), skipStop.getTo());
    stop.addSkipStop(skipStop);
    return skipStop;
  }
}
