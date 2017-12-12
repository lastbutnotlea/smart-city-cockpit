package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.model.Line;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController extends BaseController<Line>{

  private final LineData lineData;

  @Autowired
  public LineController(LineData lineData) {
    this.lineData = lineData;
  }

  @GetMapping
  public List<Line> getAllLines() {
    return lineData.getData();
  }

  @GetMapping("/{id}")
  public Line getLine(@PathVariable String id) {
    return getObjectForId(lineData, id);
  }

}
