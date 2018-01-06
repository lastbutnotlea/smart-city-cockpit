package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.external.C4CProperty;
import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.Line;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;

public class Helpers {

  public static final List<Line> LINES = new TpDataConnector().getLines(new ArrayList<String>() {{
    add("10");
    add("novalidid");
    add("283");
    add("46");
    add("228");
    add("7");
    add("bakerloo");
    add("hammersmith-city");
    add("jubilee");
    add("victoria");
    add("waterloo-city");
  }});

  public static LocalDateTime DUMMY_TIME = LocalDateTime.MIN.withYear(0).withHour(0).withMinute(0);

  public static void logException(Logger logger , Exception e) {
    logger.error(e.getMessage() + Arrays.stream(e.getStackTrace()).map(Object::toString)
        .collect(Collectors.joining("\n")));
  }

  public static Stream<Field> getC4CProperties(Object o) {
    return Arrays.stream(o.getClass().getDeclaredFields()).filter(f -> f.getAnnotation(C4CProperty.class) != null);
  }
}
