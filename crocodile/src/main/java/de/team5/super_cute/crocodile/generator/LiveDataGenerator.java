package de.team5.super_cute.crocodile.generator;

import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.Stop;
import de.team5.super_cute.crocodile.model.Vehicle;
import de.team5.super_cute.crocodile.util.NetworkDataBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public class LiveDataGenerator {
    @Service
    public class InitialDataGenerator {

        @Autowired
        private StopData stopData;
        @Autowired
        private VehicleData vehicleData;
        @Autowired
        private LineData lineData;
        @Autowired
        private TripData tripData;

        private NetworkDataBuilder networkDataBuilder;

        public void generateLiveData(){
            List<Stop> stops = stopData.getData();
            List<Vehicle> vehicles = vehicleData.getData();
        }
    }
}
