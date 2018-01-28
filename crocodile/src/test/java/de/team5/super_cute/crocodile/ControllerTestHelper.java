package de.team5.super_cute.crocodile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import java.util.List;
import org.junit.Assert;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class ControllerTestHelper<T extends IdentifiableObject> {

  private ObjectMapper mapper;
  private MockMvc mockMvc;
  private String baseUri;
  private TypeReference typeReference;

  public ControllerTestHelper(MockMvc mockMvc, String baseUri, TypeReference typeReference) {
    this.mockMvc = mockMvc;
    mapper = new ObjectMapper();
    this.baseUri = baseUri;
    this.typeReference = typeReference;
  }

  void testAddAndDelete(T object) throws Exception {
    Assert.assertTrue(!getObjects().contains(object));

    String response = testAdd(object);

    String id = object.getId();
    if (object instanceof Event) {
      Event e = mapper.readValue(response, Event.class);
      id = e.getId();
    } else if (object instanceof ServiceRequest) {
      ServiceRequest sr = mapper.readValue(response, ServiceRequest.class);
      id = sr.getId();
    }

    this.mockMvc.perform(delete(baseUri + "/" + id));

    Assert.assertTrue(!getObjects().contains(object));
  }

  List<T> getObjects() throws Exception {
    String o = this.mockMvc.perform(get(baseUri)).andReturn().getResponse().getContentAsString();
    return mapper.readValue(o, typeReference);
  }

  String testAdd(T object) throws Exception {
    String response = this.mockMvc.perform(post(baseUri).contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(object))).andReturn().getResponse().getContentAsString();
    Assert.assertTrue(getObjects().contains(object));
    return response;
  }

}
