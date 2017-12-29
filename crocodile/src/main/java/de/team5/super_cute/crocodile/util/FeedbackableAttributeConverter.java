package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Feedbackable;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
@Component
public class FeedbackableAttributeConverter implements
        AttributeConverter<Feedbackable, String> {

    private static LineData lineData;
    private static VehicleData vehicleData;
    private static  StopData stopData;

    @Autowired
    public void setLineData(LineData lineData){
        FeedbackableAttributeConverter.lineData = lineData;
    }

    @Autowired
    public void setVehicleData(VehicleData vehicleData){
        FeedbackableAttributeConverter.vehicleData = vehicleData;
    }

    @Autowired
    public void setStopData(StopData stopData){
        FeedbackableAttributeConverter.stopData = stopData;
    }

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
