package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.config.LiveDataConfig;
import de.team5.super_cute.crocodile.jsonclasses.LiveDataConfiguration;
import de.team5.super_cute.crocodile.jsonclasses.LiveDataConfigurationCollection;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/configuration")
public class ConfigurationController {

  /**
   * @return a collection containing three preset LiveDataConfigurations
   */
  @GetMapping("/standard")
  public LiveDataConfigurationCollection getStandardConfigurations() {
    return new LiveDataConfigurationCollection();
  }

  /**
   * @return the current system configuration
   */
  @GetMapping("/current")
  public LiveDataConfiguration getCurrentConfiguration() {
    return LiveDataConfig.getCurrentConfiguration();
  }

  /**
   * Sets the current system configuration to
   * @param configuration
   * @return the new system configuration
   */
  @PostMapping
  public LiveDataConfiguration setCurrentConfiguration(@RequestBody LiveDataConfiguration configuration) {
    LiveDataConfig.setLiveDataConfiguration(configuration);
    return LiveDataConfig.getCurrentConfiguration();
  }

}
