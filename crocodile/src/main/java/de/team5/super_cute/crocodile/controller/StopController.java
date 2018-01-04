package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.model.Line;
import java.util.List;

import de.team5.super_cute.crocodile.model.Stop;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stops")
public class StopController extends BaseController<Stop> {

  private LineData lineData;

  @Autowired
  public StopController(BaseData<Stop> stopData, LineData lineData) {
    data = stopData;
    this.lineData = lineData;
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
  public List<Line> getLinesForStop(@PathVariable String id) {
    return lineData.getData().stream()
        .filter(
            l -> l.getStopsOutbound().stream().anyMatch(s -> s.getId().equals(id)) ||
                 l.getStopsInbound().stream().anyMatch(s -> s.getId().equals(id)))
        .collect(Collectors.toList());
  }
}
