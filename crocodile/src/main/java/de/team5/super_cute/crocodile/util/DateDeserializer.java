package de.team5.super_cute.crocodile.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;

public class DateDeserializer extends StdDeserializer<LocalDateTime> {

  public DateDeserializer() {
    this(null);
  }

  public DateDeserializer(Class<?> vc) {
    super(vc);
  }

  @Override
  public LocalDateTime deserialize(JsonParser jp, DeserializationContext ctxt)
      throws IOException, JsonProcessingException {

    return LocalDateTime.parse(jp.getValueAsString());
  }
}
