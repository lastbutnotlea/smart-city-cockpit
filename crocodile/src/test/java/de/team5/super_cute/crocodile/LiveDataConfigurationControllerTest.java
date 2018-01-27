package de.team5.super_cute.crocodile;

import static de.team5.super_cute.crocodile.config.AppConfiguration.API_PREFIX;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.team5.super_cute.crocodile.jsonclasses.LiveDataConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest
public class LiveDataConfigurationControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testLiveDataConfiguration() throws Exception {
    LiveDataConfiguration configuration = new LiveDataConfiguration(3, 5, 9);
    String configurationJson = new ObjectMapper().writeValueAsString(configuration);
    this.mockMvc.perform(post(API_PREFIX + "/configuration").contentType(MediaType.APPLICATION_JSON).content(configurationJson))
        .andExpect(content().json(configurationJson));
    this.mockMvc.perform(get(API_PREFIX + "/configuration/current"))
        .andExpect(content().json(configurationJson));
  }

}
