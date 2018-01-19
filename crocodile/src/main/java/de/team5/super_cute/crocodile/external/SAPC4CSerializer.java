package de.team5.super_cute.crocodile.external;

import static de.team5.super_cute.crocodile.util.Helpers.getInheritedAndDeclaredPrivateFields;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.c4c.C4CEntity;
import de.team5.super_cute.crocodile.model.c4c.EStatusCode;
import de.team5.super_cute.crocodile.util.Helpers;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.olingo.odata2.api.ep.entry.ODataEntry;
import org.apache.olingo.odata2.api.ep.feed.ODataDeltaFeed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SAPC4CSerializer {

  private static final Logger logger = LoggerFactory.getLogger(SAPC4CSerializer.class);

  public String serializeC4CEntityToString(C4CEntity entity) throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();

    Map<String, Object> map = serializeC4CEntity(entity);
    String json = mapper.writeValueAsString(map);
    return json;
  }

  private Map<String, Object> serializeC4CEntity(C4CEntity entity)
      throws JsonProcessingException {
    Map<String, Object> propMap = new HashMap<>();

    for (Field field :
        Arrays.stream(entity.getClass().getDeclaredFields())
            .filter(f -> f.getAnnotation(C4CProperty.class) != null)
            .collect(Collectors.toList())) {
      field.setAccessible(true);
      C4CProperty c4CAnnotation = field.getAnnotation(C4CProperty.class);
      try {
        // Typen die extra Metadata Format benötigen
        if (!StringUtils.isBlank(c4CAnnotation.metadataType())) {
          Map<String, Object> complexType = new HashMap<>();
          propMap.put(c4CAnnotation.name(), complexType);

          Map<String, Object> metadata = new HashMap<>();
          complexType.put("__metadata", metadata);
          metadata.put("type", c4CAnnotation.metadataType());

          Object content = null;
          if (c4CAnnotation.metadataType().equals("c4codata.LOCALNORMALISED_DateTime")) {
            complexType.put("timeZoneCode", "CET");
            content = localDateTimeToC4CDateString((LocalDateTime) field.get(entity));
          } else if (c4CAnnotation.metadataType().equals("c4codata.EXTENDED_Name")) {
            complexType.put("languageCode", "EN");
            content = field.get(entity);
          }
          complexType.put("content", content);

        } // Strings
        else if (field.getType().equals(String.class)
            && !StringUtils.isBlank((String) field.get(entity))) {
          // check for correct length
          String text = (String) field.get(entity);
          if (text.length() > c4CAnnotation.maxLength()) {
            logger.warn("The field " + field.getName() + " with the value '" + text
                + "' is too long. The maximal length accepted by C4C is: " + c4CAnnotation
                .maxLength());
          }
          propMap.put(c4CAnnotation.name(), field.get(entity));

        } // LocalDateTime
        else if (field.getType().equals(LocalDateTime.class)) {
          if (field.getName().equals("dueDate")) {
            propMap.put(c4CAnnotation.name(), ((LocalDateTime) field.get(entity)).toString() + "Z");
          } else {
            propMap.put(c4CAnnotation.name(),
                localDateTimeToC4CDateString((LocalDateTime) field.get(entity)));
          }

        } // EStatusCode
        else if (field.getType().equals(EStatusCode.class)) {
          propMap.put(c4CAnnotation.name(),
              Integer.toString(((EStatusCode) field.get(entity)).getValue()));

        } // EState
        else if (field.getType().equals(EState.class)) {
          propMap.put(c4CAnnotation.name(),
              ((EState) field.get(entity)).stateToC4CPriority());

        } // Listen
        else if (field.getType().equals(List.class)) {
          ArrayList<Map<String, Object>> maps = new ArrayList<>();
          propMap.put(c4CAnnotation.name(), maps);
          if (((Class<?>) ((ParameterizedType) field.getGenericType()).getActualTypeArguments()[0])
              .getSuperclass().equals(C4CEntity.class)) {
            List<C4CEntity> items = (List<C4CEntity>) field.get(entity);
            for (C4CEntity item : items) {
              maps.add(serializeC4CEntity(item));
            }
          }
        }

      } catch (IllegalAccessException e) {
        Helpers.logException(logger, e); // on access → continue
      }
    }

    return propMap;
  }

  private String localDateTimeToC4CDateString(LocalDateTime time) {
    return String.format(new StringBuilder().append("/Date(")
        .append(time.atZone(ZoneId.of("UTC")).toInstant().toEpochMilli()).append(")/")
        .toString());
  }
  /**
   * Gets all relevant fields from entry and sets them in result.
   *
   * @param entry The ODataEntry to get the data from.
   * @param result The target entity. Its type decides how the ODataEntry is interpreted and which
   * data will be transferred (see @C4CProperty Annotations)
   * @return The C4CEntity with all C4CProperty fields filled.
   */
  public C4CEntity mapEntryToC4CEntity(ODataEntry entry, C4CEntity result) {
    Map<String, Object> propMap = entry.getProperties();

    for (Map.Entry<String, Object> e : propMap.entrySet()) {
      Object value = e.getValue();
      String propName = e.getKey();

      Optional<Field> matchingField = getFieldWithC4CAnnotation(result, propName);
      matchingField.ifPresent(field -> {
        field.setAccessible(true);
        try {
          // String
          if (value instanceof String) {
            if (field.getType().equals(EStatusCode.class)) {
              field.set(result, EStatusCode.getStatusCode((String) value));
            } else if (field.getType().equals(EState.class)) {
              field.set(result, EState.c4CPriorityToState((String) value));
            } else if (field.getName().equals("dueDate")) {
              String dateWithTimeZone = (String) value;
              field.set(result, LocalDateTime.parse(dateWithTimeZone.substring(0, dateWithTimeZone.length() - 1)));
            } else {
              field.set(result, value);
            }
          } // DateTime
          else if (value instanceof GregorianCalendar) {
            field.set(result, ((GregorianCalendar) value).toZonedDateTime().toLocalDateTime());
          }
          // Metadata Type
          else if (value instanceof HashMap) {
            Object content = ((HashMap) value).get("content");
            if (content.getClass().equals(String.class)) {
              field.set(result, content);
            } // DateTime
            else if (content instanceof GregorianCalendar) {
              field.set(result, ((GregorianCalendar) content).toZonedDateTime().toLocalDateTime());
            }
          } // Associated Entities
          else if (value instanceof ODataDeltaFeed) {
            C4CEntity exampleEntity = (C4CEntity) ((Class<?>) ((ParameterizedType) field
                .getGenericType()).getActualTypeArguments()[0])
                .getConstructor().newInstance();
            field.set(result,
                mapListOfEntriesToListOfC4CEntities((ODataDeltaFeed) value, exampleEntity));
          }
        } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException | InstantiationException e1) {
          Helpers.logException(logger, e1);
        }
      });
    }

    return result;
  }

  private List<C4CEntity> mapListOfEntriesToListOfC4CEntities(ODataDeltaFeed feed,
      C4CEntity exampleEntity) {
    List<ODataEntry> entries = feed.getEntries();
    ArrayList<C4CEntity> results = new ArrayList<>();

    for (ODataEntry entry : entries) {
      results.add(mapEntryToC4CEntity(entry, exampleEntity.getEmptyObject()));
    }

    return results;
  }

  private Optional<Field> getFieldWithC4CAnnotation(C4CEntity entity, String name) {
    return getInheritedAndDeclaredPrivateFields(entity.getClass())
        .stream()
        .filter((Field f) -> Arrays.stream(f.getDeclaredAnnotations())
            .filter(a -> a.annotationType().equals(C4CProperty.class))
            .map(C4CProperty.class::cast)
            .anyMatch(c -> c.name().equals(name)))
        .findAny();
  }

}
