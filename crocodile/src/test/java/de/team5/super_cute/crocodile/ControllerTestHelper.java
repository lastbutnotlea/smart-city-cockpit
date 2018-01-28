package de.team5.super_cute.crocodile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.util.List;
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
    assert(!getObjects().contains(object));

    testAdd(object);

    assert(getObjects().contains(object));

    this.mockMvc.perform(delete(baseUri + "/" + object.getId()));

    assert(!getObjects().contains(object));
  }

  List<T> getObjects() throws Exception{
    String o = this.mockMvc.perform(get(baseUri)).andReturn().getResponse().getContentAsString();
    return mapper.readValue(o, typeReference);
  }

  void testAdd(T object) throws Exception {
    this.mockMvc.perform(post(baseUri).contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(object)));
  }

}
