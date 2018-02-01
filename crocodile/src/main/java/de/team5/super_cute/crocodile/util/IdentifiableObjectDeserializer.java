package de.team5.super_cute.crocodile.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class IdentifiableObjectDeserializer extends StdDeserializer<IdentifiableObject> {

  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private StopData stopData;

  public IdentifiableObjectDeserializer() {
    this(null);
  }

  public IdentifiableObjectDeserializer(Class<?> vc) {
    super(vc);
  }

  @Override
  public IdentifiableObject deserialize(JsonParser jp, DeserializationContext ctxt)
      throws IOException {
    String id = "";

    JsonToken currentToken = null;
    while ((currentToken = jp.nextValue()) != null) {
      if (jp.getCurrentName().equals("id")) {
        id = jp.getValueAsString();
        break;
      }
    }

    if (id.startsWith(Vehicle.class.getSimpleName())) {
      return vehicleData.getObjectForId(id);
    } else {
      return stopData.getObjectForId(id);
    }
  }
}
