package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.config.CacheConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Configuration
@ComponentScan("de.team5.super_cute.crocodile.*")
@Import({AppConfiguration.class, CacheConfig.class})
public class CrocodileApplication {

  public static void main(String[] args) {
    SpringApplication.run(CrocodileApplication.class, args);
  }
}
