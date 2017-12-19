package de.team5.super_cute.crocodile.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.awt.Color;
import java.io.IOException;

public class ColorSerializer extends JsonSerializer<Color> {
  @Override
  public void serialize(Color value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
    gen.writeStartObject();
    gen.writeFieldName("argb");
    gen.writeString(Integer.toHexString(value.getRGB()));
    gen.writeEndObject();
  }
}

