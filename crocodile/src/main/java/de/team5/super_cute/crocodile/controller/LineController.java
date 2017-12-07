package de.team5.super_cute.crocodile.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lines")
public class LineController {

  /**
   * @return all Lines as Json
   */
  @GetMapping
  public String getAllLines() {
    return "dummy lines";
  }

  @GetMapping("/{line_id}")
  public String getLine(@PathVariable String id) {
    return "dummy single line";
  }

}
