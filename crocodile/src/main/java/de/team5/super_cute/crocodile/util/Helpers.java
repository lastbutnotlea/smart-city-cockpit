package de.team5.super_cute.crocodile.util;

import de.team5.super_cute.crocodile.external.C4CProperty;
import de.team5.super_cute.crocodile.external.TpDataConnector;
import de.team5.super_cute.crocodile.model.EServiceType;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.model.c4c.C4CNotes;
import de.team5.super_cute.crocodile.model.c4c.EC4CNotesTypeCode;
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

  public static String SAP_ACCOUNT_ID = "4000560"; // wohl unser Account 'Uni Augsburg02'

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



  private static boolean createdServiceRequest = false;

  public static ServiceRequest generateTestServiceRequest(IdentifiableObject target) {
    if (createdServiceRequest)
      return null;

    List<C4CNotes> notes = new ArrayList<C4CNotes>() {{
      add(new C4CNotes("Please clean this mess.", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
      add(new C4CNotes("Please clean this mess. I really really mean it", EC4CNotesTypeCode.SERVICE_REQUEST_DESCRIPTION));
    }};
    //vehicleData.addObject(new Vehicle())
    ServiceRequest srr = new ServiceRequest("Reinigung des Fahrzeugs | " + Math.random(),
        EState.FINE, LocalDateTime
        .now().plusDays(5),
        EServiceType.MAINTENANCE, notes, target.getId(), "Feedback_0");
    return srr;
  }
}
