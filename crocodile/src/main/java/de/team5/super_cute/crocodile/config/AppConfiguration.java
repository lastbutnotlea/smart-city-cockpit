package de.team5.super_cute.crocodile.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@ConditionalOnProperty(
    value = "app.scheduling.enable", havingValue = "true", matchIfMissing = true
)
@Configuration
@EnableScheduling
public class AppConfiguration {
  public static final int LIVEDATA_FREQUENCY = 30000;
  public static final String API_PREFIX = "/api";
}
