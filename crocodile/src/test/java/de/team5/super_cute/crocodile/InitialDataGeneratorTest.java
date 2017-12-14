package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import org.junit.Test;

public class InitialDataGeneratorTest {

  @Test
  public void testGetLines() {
    InitialDataGenerator initialDataGenerator = new InitialDataGenerator();
    initialDataGenerator.generateInitialPrototypeSetup();
  }
}
