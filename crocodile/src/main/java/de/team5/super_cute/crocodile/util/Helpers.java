package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.external.C4CProperty;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;

public class Helpers {

  public static final String PATCH = "PATCH";
  public static final String POST = "POST";

  public static final LocalDateTime DUMMY_TIME = LocalDateTime.MIN.withYear(0).withHour(0).withMinute(0);

  public static final String SAP_ACCOUNT_ID = "4000560"; // wohl unser Account 'Uni Augsburg02'

  public static void logException(Logger logger , Exception e) {
    logger.error(e.getMessage() + ExceptionUtils.getStackTrace(e));
  }

  public static Stream<Field> getC4CProperties(Object o) {
    return Arrays.stream(o.getClass().getDeclaredFields()).filter(f -> f.getAnnotation(C4CProperty.class) != null);
  }

  // from https://stackoverflow.com/a/3567901/6456126
  public static List<Field> getInheritedAndDeclaredPrivateFields(Class<?> type) {
    List<Field> result = new ArrayList<Field>();

    Class<?> i = type;
    while (i != null && i != Object.class) {
      Collections.addAll(result, i.getDeclaredFields());
      i = i.getSuperclass();
    }

    return result;
  }

  public static String makeIdToJSON(String id) {
    return "{\"id\":\"" + id + "\"}";
  }
}
