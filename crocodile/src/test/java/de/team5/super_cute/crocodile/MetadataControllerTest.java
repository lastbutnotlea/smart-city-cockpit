package de.team5.super_cute.crocodile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
@TestPropertySource(properties = "app.scheduling.enable=false")
public class MetadataControllerTest {

  private static final String METADATA_MAPPING = "/api/metadata";
  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testFeedbackTypesMetadata() throws Exception {
    testFilterJson("/feedback-types", "[\"VEHICLE_FEEDBACK\",\"STOP_FEEDBACK\"]");
  }

  @Test
  public void testStatesMetadata() throws Exception {
    testFilterJson("/states", "[\"FINE\",\"PROBLEMATIC\",\"CRITICAL\"]");
  }

  @Test
  public void testVehicleTypesMetadata() throws Exception {
    testFilterJson("/vehicle-types", "[\"BUS\",\"SUBWAY\"]");
  }

  @Test
  public void testLinesMetadata() throws Exception {
    testFilterJson("/lines",
        "[\"10\",\"283\",\"46\",\"228\",\"7\",\"Bakerloo\",\"Hammersmith & City\",\"Jubilee\",\"Victoria\",\"Waterloo & City\"]");
  }

  @Test
  public void testStatusCodesMetadata() throws Exception {
    testFilterJson("/status-codes",
        "[\"OPEN\",\"IN_PROCESS\",\"CUSTOMER_ACTION\",\"COMPLETED\",\"CLOSED\"]");
  }

  @Test
  public void testServiceTypesMetadata() throws Exception {
    testFilterJson("/service-types", "[\"CLEANING\",\"MAINTENANCE\"]");
  }

  @Test
  public void testFilterMetadata() throws Exception {
    String linesJson = getJsonString("/lines");
    String vehicleTypesJson = getJsonString("/vehicle-types");
    String statesJson = getJsonString("/states");

    String filterJson = getJsonString("/filter");
    Assert.assertEquals(filterJson,
        "{\"lines\":" + linesJson +
            ",\"vehicleTypes\":" + vehicleTypesJson +
            ",\"states\":" + statesJson + "}");
  }

  private void testFilterJson(String requestSuffix, String expectedJson) throws Exception {
    mockMvc.perform(get(METADATA_MAPPING + requestSuffix)).andExpect(content().json(expectedJson));
  }

  private String getJsonString(String requestSuffix) throws Exception {
    return mockMvc.perform(get(METADATA_MAPPING + requestSuffix)).andReturn().getResponse()
        .getContentAsString();
  }

}
