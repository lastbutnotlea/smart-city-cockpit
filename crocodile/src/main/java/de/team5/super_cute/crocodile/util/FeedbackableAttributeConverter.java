package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Feedbackable;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class FeedbackableAttributeConverter implements
        AttributeConverter<Feedbackable, String> {

    @Autowired
    LineData lineData;

    @Autowired
    VehicleData vehicleData;

    @Autowired
    StopData stopData;

    @Override
    public String convertToDatabaseColumn(Feedbackable feedbackable) {
        return (feedbackable == null ? null : feedbackable.getId());
    }

    @Override
    public Feedbackable convertToEntityAttribute(String id) {
        if(id.startsWith(Line.class.getSimpleName())){
            return lineData.getObjectForId(id);
        } else if(id.startsWith(Vehicle.class.getSimpleName())) {
            return vehicleData.getObjectForId(id);
        } else {
            return stopData.getObjectForId(id);
        }
    }
}
