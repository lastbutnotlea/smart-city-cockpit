package de.team5.super_cute.crocodile.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.EVehicleType;
import de.team5.super_cute.crocodile.model.Line;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController extends BaseController<Line>{

  @Autowired
  public LineController(BaseData<Line> lineData) {
    data = lineData;
  }

  @GetMapping
  public List<Line> getAllLines() {
    return data.getData();
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    return getObjectForId(id);
  }

  @GetMapping("/filter-data")
  public FilterData getFilterData() {
    FilterData fd = new FilterData();
    fd.lineNames = data.getData().stream().map(Line::getName).collect(Collectors.toList());
    fd.types = Arrays.stream(EVehicleType.values()).map(EVehicleType::toString).collect(Collectors.toList());
    return fd;
  }

  private class FilterData {
    @JsonProperty
    List<String> lineNames;
    @JsonProperty
    List<String> types;
  }
}
