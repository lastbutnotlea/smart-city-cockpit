package de.team5.super_cute.crocodile.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LiveDataConfig {
    public static final int STOP_DEFECT_PERCENTAGE = 5;
    public static final int VEHICLE_DEFECT_PERCENTAGE = 5;
    public static final int DEFECT_FEEDBACK_PERCENTAGE = 50;
    public static final int VALUE_FEEDBACK_PERCENTAGE = 1;


    public static  final List<String> STOP_DEFECTS = new ArrayList<String>(){{
        add("dirty");
        add("shelter broken");
        add("bench broken");
        add("elevator not working");
        add("escalator not working");
        add("ticket-machine not working");
    }};

    public static  final List<String> VEHICLE_DEFECTS = new ArrayList<String>(){{
        add("dirty");
        add("window broken");
        add("chair broken");
        add("engine failure");
        add("brake failure");
        add("air-condition not working");
    }};

    public static  final Map<String, Integer> STOP_DEFECTS_SEVERITY = new HashMap<String, Integer>(){{
        put("dirty", 2);
        put("shelter broken", 4);
        put("bench broken", 3);
        put("elevator not working", 3);
        put("escalator not working", 2);
        put("ticket-machine not working", 4);
    }};

    public static  final Map<String, Integer> VEHICLE_DEFECTS_SEVERITY = new HashMap<String, Integer>(){{
        put("dirty", 3);
        put("window broken", 11);
        put("chair broken", 2);
        put("engine failure", 11);
        put("brake failure", 20);
        put("air-condition not working", 2);
    }};

    //severity for 0-300, 301-700, 701-1000 people waiting
    public static  final int[] PEOPLE_WAITING_SEVERITY = new int[]{0, 3, 6};

    //severity for 0-50%, 51-150%, 151-200% load
    public static  final int[] LOAD_SEVERITY = new int[]{0, 3, 6};

    //severity for 25-30, 15-24 and 31-35, 5-14 and 36-40 degree temperature
    public static  final int[] TEMPERATURE_SEVERITY = new int[]{0, 3, 6};

    //severity for  -5-5, 6-15, 16-60 mins delay
    public static  final int[] DELAY_SEVERITY = new int[]{0, 3, 6};

    public static  final Map<String, List<String>> STOP_DEFECT_FEEDBACK = new HashMap<String, List<String>>(){{
        put("dirty", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("shelter broken", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("bench broken", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("elevator not working", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("escalator not working", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("ticket-machine not working", new ArrayList<String>(){{add(""); add(""); add("");}});
    }};

    public static  final Map<String, List<String>> VEHICLE_DEFECT_FEEDBACK = new HashMap<String, List<String>>(){{
        put("dirty", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("window broken", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("chair broken", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("engine failure", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("brake failure", new ArrayList<String>(){{add(""); add(""); add("");}});
        put("air-condition not working", new ArrayList<String>(){{add(""); add(""); add("");}});
    }};

    public static  final Map<String, List<List<String>>> VALUE_FEEDBACK = new HashMap<String, List<List<String>>>(){{
        put("peopleWaiting", new ArrayList<List<String>>(){{
            //messages for low peopleWaiting
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            //messages for medium peopleWaiting
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            //messages for high peopleWaiting
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
        }});
        put("load", new ArrayList<List<String>>(){{
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
        }});
        put("temperature", new ArrayList<List<String>>(){{
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
        }});
        put("delay", new ArrayList<List<String>>(){{
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
            add(new ArrayList<String>(){{add(""); add(""); add(""); }});
        }});
    }};
}
