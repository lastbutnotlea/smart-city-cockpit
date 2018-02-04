package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.SkipStopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.jsonclasses.LineForStopData;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.SkipStop;
import de.team5.super_cute.crocodile.model.Stop;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/stops")
public class StopController extends BaseController<Stop> {

  private static final Logger logger = LoggerFactory.getLogger(StopController.class);

  private LineData lineData;
  private TripData tripData;
  private SkipStopData skipStopData;

  @Autowired
  public StopController(BaseData<Stop> stopData, LineData lineData, TripData tripData, SkipStopData skipStopData) {
    data = stopData;
    this.lineData = lineData;
    this.tripData = tripData;
    this.skipStopData = skipStopData;
  }

  @GetMapping
  public List<Stop> getAllStops() {
    logger.info("Got Request to return all stops");
    List<Stop> stops = data.getData();
    stops.sort((s1, s2) -> s1.getId().compareTo(s2.getId()));
    return stops;
  }

  @GetMapping("/{id}")
  public Stop getStop(@PathVariable String id) {
    logger.info("Got Request to return stop with id " + id);
    return getObjectForId(id);
  }

  @GetMapping("/{id}/lines")
  public List<LineForStopData> getLinesForStop(@PathVariable String id) {
    logger.info("Got Request to return stops for line with id " + id);
    List <Line> lines = lineData.getData();
    List<LineForStopData> lineForStopData = new ArrayList<>();
    for (Line line:lines) {
      if(line.getStopsInbound().stream().anyMatch(s -> s.getId().equals(id))){
        lineForStopData.add(new LineForStopData(true, line.getName(), line.getId()));
      }
      if(line.getStopsOutbound().stream().anyMatch(s -> s.getId().equals(id))){
        lineForStopData.add(new LineForStopData(false, line.getName(), line.getId()));
      }
    }
    return lineForStopData;
  }

  @PostMapping("/{id}/skip")
  public SkipStop skipStop(@PathVariable String id, @RequestBody SkipStop skipStop) {
    logger.info("Got Request to skip stop with id " + id + " with " + skipStop);
    if (skipStop.getId() == null) {
      skipStop.setId();
    }
    Stop stop = getObjectForId(id);
    Set<String> skippedStopTripIds = tripData.skipStopsInTimeFrameForAllTrips(id, skipStop.getFrom(), skipStop.getTo());
    skipStop.setSkippedTripIds(skippedStopTripIds);
    skipStop.setStopId(stop.getId());
    stop.addSkipStop(skipStop);
    skipStopData.addObject(skipStop);
    editObject(stop);
    return skipStop;
  }

  /**
   * reverts a skipping action of
   * @param skipStop
   * on the stop with the given
   * @param stopId .
   * @return the skipStop entity.
   */
  @PostMapping("{stopId}/unskip")
  public SkipStop unSkipStop(@PathVariable String stopId, @RequestBody SkipStop skipStop) {
    logger.info("Got Request to revert stop skipping for stop with id " + stopId + " previously skipped with " + skipStop);
    tripData.unskipStop(skipStop.getSkippedTripIds(), stopId);
    Stop stop = getObjectForId(stopId);
    stop.getSkipData().remove(skipStop);
    editObject(stop);
    return skipStop;
  }
}
