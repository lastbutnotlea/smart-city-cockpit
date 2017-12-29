package de.team5.super_cute.crocodile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@Configuration
@ComponentScan("de.team5.super_cute.crocodile.*")
@EnableScheduling
public class CrocodileApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrocodileApplication.class, args);
	}
}
