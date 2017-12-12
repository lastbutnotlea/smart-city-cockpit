package de.team5.super_cute.crocodile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration
@ComponentScan("de.team5.super_cute.crocodile.*")
public class CrocodileApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrocodileApplication.class, args);
	}
}
