package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.Feedback;
import de.team5.super_cute.crocodile.model.TickerItemable;
import de.team5.super_cute.crocodile.model.Vehicle;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Converter(autoApply = true)
@Component
public class TickerItemableAttributeConverter implements
    AttributeConverter<TickerItemable, String> {

  //TODO
  //private static EventData eventData;
  private static VehicleData vehicleData;
  private static StopData stopData;
  private static FeedbackData feedbackData;

  //TODO
/*  @Autowired
  public void setEventData(EventData eventData) {
    TickerItemableAttributeConverter.eventData = eventData;
  }*/

  @Autowired
  public void setVehicleData(VehicleData vehicleData) {
    TickerItemableAttributeConverter.vehicleData = vehicleData;
  }

  @Autowired
  public void setStopData(StopData stopData) {
    TickerItemableAttributeConverter.stopData = stopData;
  }

  @Autowired
  public void setFeedbackData(FeedbackData feedbackData) {
    TickerItemableAttributeConverter.feedbackData = feedbackData;
  }

  @Override
  public String convertToDatabaseColumn(TickerItemable tickerItemable) {
    return (tickerItemable == null ? null : tickerItemable.getId());
  }

  @Override
  public TickerItemable convertToEntityAttribute(String id) {
    if (id.startsWith(Feedback.class.getSimpleName())) {
      return feedbackData.getObjectForId(id);
    } else if (id.startsWith(Vehicle.class.getSimpleName())) {
      return vehicleData.getObjectForId(id);
    } else if (id.startsWith(Event.class.getSimpleName())) {
      //TODO
      //return eventData.getObjectForId(id);
      return null;
    } else {
      return stopData.getObjectForId(id);
    }
  }
}
