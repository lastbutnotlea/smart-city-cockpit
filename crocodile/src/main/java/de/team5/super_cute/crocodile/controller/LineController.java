package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.jsonclasses.PositionData;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.service.VehiclePositionService;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController extends BaseController<Line> {

  private Logger logger = LoggerFactory.getLogger(this.getClass());

  private VehiclePositionService vehiclePositionService;

  @Autowired
  public LineController(BaseData<Line> lineData, VehiclePositionService vehiclePositionService) {
    data = lineData;
    this.vehiclePositionService = vehiclePositionService;
  }

  @GetMapping
  public List<Line> getAllLines() {
    logger.info("Got request for all lines");
    return data.getData().stream().peek(l -> l.setState(((LineData) data).calculateLineState(l)))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    logger.info("Got request for line with id " + id);
    Line line = getObjectForId(id);
    line.setState(((LineData) data).calculateLineState(line));
    return line;
  }

  @GetMapping("/filter-data")
  public FilterData getFilterData() {
    logger.info("Got request for filter data");
    FilterData fd = new FilterData();
    fd.lineNames = data.getData().stream().map(Line::getName).collect(Collectors.toList());
    fd.types = Arrays.stream(EVehicleType.values()).map(EVehicleType::toString)
        .collect(Collectors.toList());
    return fd;
  }

  @GetMapping("/{id}/vehicles/inbound")
  public PositionData getVehiclePositionInbound(@PathVariable String id) {
    logger.info("Got request for vehicles inbound of line with id " + id);
    return vehiclePositionService.getVehiclePositions(getObjectForId(id), true);
  }

  @GetMapping("/{id}/vehicles/outbound")
  public PositionData getVehiclePositionOutbound(@PathVariable String id) {
    logger.info("Got request for vehicles outbound of line with id " + id);
    return vehiclePositionService.getVehiclePositions(getObjectForId(id), false);
  }

// TODO move to jsonclasses when doing the metadatacontroller
  private class FilterData {

    @JsonProperty
    List<String> lineNames;
    @JsonProperty
    List<String> types;
  }

}
