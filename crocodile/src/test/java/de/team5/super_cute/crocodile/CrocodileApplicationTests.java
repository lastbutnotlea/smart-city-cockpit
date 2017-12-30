package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "app.scheduling.enable=false")
public class CrocodileApplicationTests {

	@Test
	public void contextLoads() {
	}

}
