package de.team5.super_cute.crocodile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.util.ColorDeserializer;
import de.team5.super_cute.crocodile.util.ColorSerializer;
import java.awt.Color;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class ControllerTestHelper<T extends IdentifiableObject> {

  private ObjectMapper mapper;

  private MockMvc mockMvc;

  public ControllerTestHelper(MockMvc mockMvc) {
    this.mockMvc = mockMvc;
    mapper = new ObjectMapper();
    SimpleModule module = new SimpleModule();
    module.addSerializer(Color.class, new ColorSerializer());
    module.addDeserializer(Color.class, new ColorDeserializer());
    mapper.registerModule(module);
  }

  void testAddAndDelete(String baseUri, T object, TypeReference typeReference) throws Exception{
    assert(!getObjects(baseUri, typeReference).contains(object));

    this.mockMvc.perform(post(baseUri).contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(object))).andExpect(status().isCreated());

    assert(getObjects(baseUri, typeReference).contains(object));

    this.mockMvc.perform(delete(baseUri + "/" + object.getId())).andExpect(status().isOk());

    assert(!getObjects(baseUri, typeReference).contains(object));
  }

  List<T> getObjects(String baseUri, TypeReference typeReference) throws Exception{
    String o = this.mockMvc.perform(get(baseUri)).andReturn().getResponse().getContentAsString();
    return mapper.readValue(o, typeReference);
  }

}