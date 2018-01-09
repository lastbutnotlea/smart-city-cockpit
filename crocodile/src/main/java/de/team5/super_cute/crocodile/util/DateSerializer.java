package de.team5.super_cute.crocodile.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.time.LocalDateTime;

public class DateSerializer extends StdSerializer<LocalDateTime> {

  public DateSerializer() {
    this(null);
  }

  public DateSerializer(Class<LocalDateTime> t) {
    super(t);
  }

  @Override
  public void serialize(
      LocalDateTime value, JsonGenerator jgen, SerializerProvider provider)
      throws IOException, JsonProcessingException {

    jgen.writeString(value.toString());
  }

}
