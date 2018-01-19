package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.ServiceOrFeedbackTargetObject;
import de.team5.super_cute.crocodile.model.Vehicle;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Converter(autoApply = true)
@Component
public class FeedbackableAttributeConverter implements
    AttributeConverter<ServiceOrFeedbackTargetObject, String> {

  private static LineData lineData;
  private static VehicleData vehicleData;
  private static StopData stopData;

  @Autowired
  public void setLineData(LineData lineData) {
    FeedbackableAttributeConverter.lineData = lineData;
  }

  @Autowired
  public void setVehicleData(VehicleData vehicleData) {
    FeedbackableAttributeConverter.vehicleData = vehicleData;
  }

  @Autowired
  public void setStopData(StopData stopData) {
    FeedbackableAttributeConverter.stopData = stopData;
  }

  @Override
  public String convertToDatabaseColumn(ServiceOrFeedbackTargetObject feedbackable) {
    return (feedbackable == null ? null : ((IdentifiableObject) feedbackable).getId());
  }

  @Override
  public ServiceOrFeedbackTargetObject convertToEntityAttribute(String id) {
    if (id.startsWith(Vehicle.class.getSimpleName())) {
      return vehicleData.getObjectForId(id);
    } else {
      return stopData.getObjectForId(id);
    }
  }
}
