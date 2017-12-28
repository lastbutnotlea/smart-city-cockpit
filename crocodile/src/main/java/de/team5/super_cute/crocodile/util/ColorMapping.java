package de.team5.super_cute.crocodile.util;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class ColorMapping {
    public static final Map<String, Color> lineColors = new HashMap<String, Color>(){{
        put("10", new Color(255, 0, 0, 255));
        put("283", new Color(0, 153, 51, 255));
        put("46", new Color(0, 0, 255, 255));
        put("228", new Color(255, 204, 102, 255));
        put("7", new Color(0, 255, 255, 255));
        put("Bakerloo", new Color(102, 153, 255, 255));
        put("Hammersmith & City", new Color(255, 153, 255, 255));
        put("Jubilee", new Color(255, 128, 0, 255));
        put("Victoria", new Color(128, 0, 255, 255));
        put("Waterloo & City", new Color(0, 255, 128, 255));
    }};

    public static final Map<String, Color> girlyColors = new HashMap<String, Color>(){{
        put("10", new Color(204, 0, 204, 255));
        put("283", new Color(255, 102, 153, 255));
        put("46", new Color(153, 51, 255, 255));
        put("228", new Color(184, 46, 138, 255));
        put("7", new Color(153, 255, 255, 255));
        put("Bakerloo", new Color(102, 153, 255, 255));
        put("Hammersmith & City", new Color(255, 153, 255, 255));
        put("Jubilee", new Color(255, 0, 170, 255));
        put("Victoria", new Color(128, 0, 255, 255));
        put("Waterloo & City", new Color(204, 153, 255, 255));
    }};


}
