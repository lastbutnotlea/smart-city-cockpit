package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/test")
public class ManualTestController {

  @Autowired
  private InitialDataGenerator initialDataGenerator;

  @GetMapping("/getData")
  public void initializeData() {
    initialDataGenerator.generateInitialPrototypeSetup();
  }
}
