package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.generator.InitialDataGenerator;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = "app.scheduling.enable=false")
public class InitialDataGeneratorTest {

  @Autowired
  InitialDataGenerator initialDataGenerator;

  @Autowired
  LineData lineData;

  @Test
  public void testGenerateInitialPrototypeSetup() {
    initialDataGenerator.generateInitialPrototypeSetup();
  }

  @Test
  @Ignore // sadly this repeatedly breaks our tests, because the tfl api does not answer reliably
  public void testLineExist() {
    assert(lineData.exists("10"));
    assert(lineData.exists("Bakerloo"));
    assert(!lineData.exists("noline"));
  }
}
