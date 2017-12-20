package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class InitialDataGeneratorTest {

  @Autowired
  InitialDataGenerator initialDataGenerator;

  @Test
  public void testGenerateInitialPrototypeSetup() {
    initialDataGenerator.generateInitialPrototypeSetup();
  }
}
