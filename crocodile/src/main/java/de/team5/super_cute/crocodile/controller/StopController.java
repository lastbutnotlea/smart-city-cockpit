package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import java.util.List;

import de.team5.super_cute.crocodile.model.Stop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stops")
public class StopController extends BaseController<Stop> {

  @Autowired
  public StopController(BaseData<Stop> stopData) {
    data = stopData;
  }

  @GetMapping
  public List<Stop> getAllStops() {
    return data.getData();
  }

  @GetMapping("/{id}")
  public Stop getStop(@PathVariable String id) {
    return getObjectForId(id);
  }
}
