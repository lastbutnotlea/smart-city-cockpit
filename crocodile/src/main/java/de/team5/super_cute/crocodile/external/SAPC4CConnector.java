package de.team5.super_cute.crocodile.external;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.team5.super_cute.crocodile.model.C4CEntity;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.cookie.CookieSpecProvider;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.cookie.RFC6265CookieSpecProvider;
import org.apache.olingo.odata2.api.batch.BatchException;
import org.apache.olingo.odata2.api.client.batch.BatchChangeSet;
import org.apache.olingo.odata2.api.client.batch.BatchChangeSetPart;
import org.apache.olingo.odata2.api.client.batch.BatchPart;
import org.apache.olingo.odata2.api.client.batch.BatchSingleResponse;
import org.apache.olingo.odata2.api.edm.Edm;
import org.apache.olingo.odata2.api.edm.EdmEntityContainer;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProvider;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.apache.olingo.odata2.api.ep.EntityProviderReadProperties;
import org.apache.olingo.odata2.api.ep.entry.ODataEntry;
import org.apache.olingo.odata2.api.ep.feed.ODataFeed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Diese Klasse bildet den Connector zur C4C Plattform von SAP über die OData API.
 *
 * Der Connector arbeitet auf zwei Objekttypen: - ServiceRequest - Event
 */
@Service("sapC4CConnector")
public class SAPC4CConnector {

  private static final String BASE_URL = "https://my304939.crm.ondemand.com/sap/c4c/odata/v1/c4codata/";
  private static final String METADATA = "$metadata";
  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String AUTHORIZATION =
      "Basic VW5pQXVnc2J1cmcwMjpBdWdzYnVyZzEyM238bmNoZW4=";
  private static final String CSRF_TOKEN_HEADER = "x-csrf-token";
  private static final String FETCH = "fetch";
  private static final String CONTENT_TYPE = "application/json";
  private static final String CONTENT_TYPE_HEADER = "Content-Type";
  private static final String ACCEPT_HEADER = "Accept";
  private static final String CONTENT_ID_HEADER = "Content-ID";
  private static final String FILTER_QUERY = "?$filter=CreatedBy%20eq%20%27Uni%20Augsburg02%27&$expand";
  private final String boundary = "batch_" + UUID.randomUUID().toString();
  private Logger logger = LoggerFactory.getLogger(this.getClass());
  private HttpClient httpClient = null;
  private Edm metadataDefinition = null;
  private String csrfToken = null;
  private CookieStore cookieStore = null;

  public SAPC4CConnector() {
  }

  private HttpClient getHttpClient() {
    if (httpClient == null) {
      cookieStore = new BasicCookieStore();
      httpClient = HttpClientBuilder.create().setDefaultCookieStore(cookieStore)
          .setDefaultRequestConfig(RequestConfig.custom().setCookieSpec(
              CookieSpecs.DEFAULT).build()).build();
    }
    return httpClient;
  }

  private Edm getMetadataDefinition() throws IOException, EntityProviderException {
    if (metadataDefinition != null) {
      return metadataDefinition;
    }

    String serviceUrl = BASE_URL + METADATA;

    HttpClientContext context = HttpClientContext.create();
    RFC6265CookieSpecProvider cookieSpecProvider = new RFC6265CookieSpecProvider();
    context.setCookieSpecRegistry(RegistryBuilder.<CookieSpecProvider>create()
        .register(CookieSpecs.DEFAULT, cookieSpecProvider)
        .register(CookieSpecs.STANDARD, cookieSpecProvider)
        .register(CookieSpecs.STANDARD_STRICT, cookieSpecProvider)
        .build());
    context.setCookieStore(cookieStore);

    HttpGet get = new HttpGet(serviceUrl);
    get.setHeader(AUTHORIZATION_HEADER, AUTHORIZATION);
    get.setHeader(CSRF_TOKEN_HEADER, FETCH);

    HttpResponse response = getHttpClient().execute(get, context);

    csrfToken = response.getFirstHeader(CSRF_TOKEN_HEADER).getValue();

    metadataDefinition = EntityProvider.readMetadata(response.getEntity().getContent(),
        false);
    return metadataDefinition;
  }

  private String getCsrfToken() {
    if (csrfToken != null) {
      return csrfToken;
    }

    // request new metadata
    metadataDefinition = null;
    try {
      metadataDefinition = getMetadataDefinition();
    } catch (EntityProviderException | IOException e) {
      Helpers.logException(logger, e);
    }

    return csrfToken;
  }

  private InputStream executeGet(String absoluteUrl) throws IOException {
    HttpGet get = new HttpGet(absoluteUrl);
    get.setConfig(RequestConfig.DEFAULT);
    get.setHeader(AUTHORIZATION_HEADER, AUTHORIZATION);
    get.setHeader(ACCEPT_HEADER, CONTENT_TYPE);

    HttpResponse response = getHttpClient().execute(get);
    return response.getEntity().getContent();
  }

  private ODataFeed readFeed(String serviceUri, String entitySetName, String options)
      throws IllegalStateException, IOException, EntityProviderException,
      EdmException {
    Edm metadata = getMetadataDefinition();
    EdmEntityContainer entityContainer = metadata.getDefaultEntityContainer();
    String absolutUri = createUri(serviceUri, entitySetName, null, options);

    InputStream content = executeGet(absolutUri);
    return EntityProvider.readFeed(CONTENT_TYPE,
        entityContainer.getEntitySet(entitySetName), content,
        EntityProviderReadProperties.init().build());
  }

  private String createUri(String serviceUri, String entitySetName,
      String id, String options) {
    StringBuilder absolauteUri = new StringBuilder(serviceUri).append(entitySetName);
    if (id != null) {
      absolauteUri.append("('").append(id).append("')");
    }
    absolauteUri.append(options);
    return absolauteUri.toString();
  }

  /**
   * Collects all Appointments from the SAP C4C System.
   */
  public List<Event> getAppointments()
      throws EntityProviderException, EdmException, IOException {
    return getC4CEntities(new Event()).stream().filter(Event.class::isInstance)
        .map(Event.class::cast)
        .collect(
            Collectors.toList());
  }

  /**
   * Collects all Service Requests from the SAP C4C System.
   */
  public List<ServiceRequest> getServiceRequests()
      throws EntityProviderException, EdmException, IOException {
    return getC4CEntities(new ServiceRequest()).stream().filter(ServiceRequest.class::isInstance)
        .map(ServiceRequest.class::cast).collect(
            Collectors.toList());
  }

  /**
   * @return Collects all items of the Type corresponding to T from the SAP C4C System
   */
  public List<C4CEntity> getC4CEntities(C4CEntity exampleEntity)
      throws EntityProviderException, EdmException, IOException {
    List<C4CEntity> items = new ArrayList<>();

    ODataFeed feed = readFeed(BASE_URL, exampleEntity.getCollectionName(), FILTER_QUERY);

    for (ODataEntry entry : feed.getEntries()) {
      items.add(mapEntryToC4CEntity(entry, exampleEntity.getEmptyObject()));
    }

    return items;
  }

  /**
   * Gets all relevant fields from entry and sets them in result.
   *
   * @param entry The ODataEntry to get the data from.
   * @param result The target entity. Its type decides how the ODataEntry is interpreted and which
   * data will be transferred (see @C4CProperty Annotations)
   * @return The C4CEntity with all C4CProperty fields filled.
   */
  private C4CEntity mapEntryToC4CEntity(ODataEntry entry, C4CEntity result) {
    Map<String, Object> propMap = entry.getProperties();

    for (Map.Entry<String, Object> e : propMap.entrySet()) {
      Object value = e.getValue();
      String propName = e.getKey();

      Optional<Field> matchingField = getFieldWithC4CAnnotation(result, propName);
      matchingField.ifPresent(field -> {
        try {
          field.set(result, value);
        } catch (IllegalAccessException e1) {
          Helpers.logException(logger, e1);
        }
      });
    }

    return result;
  }

  private Optional<Field> getFieldWithC4CAnnotation(C4CEntity entity, String name) {
    return Arrays.stream(entity.getClass().getFields())
        .filter((Field f) -> Arrays.stream(f.getDeclaredAnnotations())
            .filter(a -> a.annotationType().equals(C4CProperty.class)).map(
                C4CProperty.class::cast).anyMatch(c -> c.name().equals(name))).findAny();
  }

  /**
   * @param entity Is written into the SAP C4C System.
   * @return "Success" or "Failure
   */
  public String putC4CEntity(C4CEntity entity)
      throws IOException, BatchException {
    List<BatchPart> batchParts = new ArrayList<>();

    BatchChangeSet changeSet = BatchChangeSet.newBuilder().build();
    String contentId = UUID.randomUUID().toString();

    Map<String, String> changeSetHeaders = new HashMap<>();
    changeSetHeaders.put(CONTENT_TYPE_HEADER, CONTENT_TYPE);
    changeSetHeaders.put(CONTENT_ID_HEADER, contentId);
    changeSetHeaders.put(ACCEPT_HEADER, CONTENT_TYPE);

    BatchChangeSetPart changeRequest = BatchChangeSetPart.method("POST")
        .uri(entity.getCollectionName()).body(serializeC4CEntityToString(entity))
        .headers(changeSetHeaders).contentId(contentId).build();
    changeSet.add(changeRequest);
    batchParts.add(changeSet);

    InputStream body = EntityProvider.writeBatchRequest(batchParts, boundary);
    String payload = IOUtils.toString(body);

    HttpResponse batchResponse = executeBatchCall(payload);

    InputStream responseBody = batchResponse.getEntity().getContent();
    String contentType = batchResponse.getFirstHeader(CONTENT_TYPE_HEADER).getValue();

    String response = IOUtils.toString(responseBody);
    List<BatchSingleResponse> responses = EntityProvider
        .parseBatchResponse(IOUtils.toInputStream(response),
            contentType);
    for (BatchSingleResponse rsp : responses) {
      // Look for only created entries
      if (Integer.parseInt(rsp.getStatusCode()) == 201) { // 201 - HttpStatus code created
        // Http POST call returns the link to the new resource via the location header
        // Format is https://<service_url>/<Collection>('key')
        String locationUrl = rsp.getHeader("location");
        if (!StringUtils.isBlank(locationUrl)) {
          //String ticketUUID = StringUtils.substringBetween(locationUrl, "'");
          return "Success";
        }
      }
    }
    System.out.println(response);
    return "Failure";
  }

  public String deleteC4CEntity(C4CEntity entity) throws IOException {
    HttpDelete delete = new HttpDelete(
        createUri(BASE_URL, entity.getCollectionName(), entity.getObjectId(), ""));
    delete.setConfig(RequestConfig.DEFAULT);
    delete.setHeader(AUTHORIZATION_HEADER, AUTHORIZATION);
    delete.setHeader(ACCEPT_HEADER, CONTENT_TYPE);
    delete.setHeader(CSRF_TOKEN_HEADER, getCsrfToken());

    HttpResponse response = getHttpClient().execute(delete);
    if (response.getStatusLine().getStatusCode() == 204) {
      return "Success";
    }
    return "Probably Failure";
  }

  private HttpResponse executeBatchCall(String body)
      throws ClientProtocolException, IOException {
    HttpPost post = new HttpPost(URI.create(BASE_URL + "/$batch"));
    post.setHeader(CONTENT_TYPE_HEADER, "multipart/mixed;boundary=" + boundary);
    post.setHeader(AUTHORIZATION_HEADER, AUTHORIZATION);
    post.setHeader(CSRF_TOKEN_HEADER, getCsrfToken());
    HttpEntity entity = new StringEntity(body);

    post.setEntity(entity);

    return getHttpClient().execute(post);
  }

  private String serializeC4CEntityToString(C4CEntity entity) throws JsonProcessingException{
    ObjectMapper mapper = new ObjectMapper();

    return mapper.writeValueAsString(serializeC4CEntity(entity));
  }

  private Map<String, Object> serializeC4CEntity(C4CEntity entity)
      throws JsonProcessingException {
    Map<String, Object> propMap = new HashMap<>();

    for (Field field :
        Arrays.stream(entity.getClass().getFields())
            .filter(f -> f.getAnnotation(C4CProperty.class) != null)
            .collect(Collectors.toList())) {
      C4CProperty c4CAnnotation = field.getAnnotation(C4CProperty.class);
      try {
        // Strings
        if (field.getType().equals(String.class)
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
          propMap.put(c4CAnnotation.name(),
              localDateTimeToC4CDateString((LocalDateTime) field.get(entity)));

        } // Typen die extre Metadata Format benötigen
        else if (!StringUtils.isBlank(c4CAnnotation.metadataType())) {
          Map<String, Object> complexType = new HashMap<>();
          propMap.put(c4CAnnotation.name(), complexType);

          Map<String, Object> metadata = new HashMap<>();
          complexType.put("__metadata", metadata);
          metadata.put("type", c4CAnnotation.metadataType());

          Object content = null;
          if (c4CAnnotation.metadataType().equals("c4codata.LOCALNORMALISED_DateTime")) {
            complexType.put("timeZoneCode", "CET");
            content = localDateTimeToC4CDateString((LocalDateTime) field.get(entity));
          }
          else if (c4CAnnotation.metadataType().equals("c4codata.EXTENDED_Name")) {
            complexType.put("languageCode", "EN");
            content = field.get(entity);
          }
          complexType.put("content", content);

        }  // Listen
        else if (field.getType().equals(List.class)) {
          List<?> list = (List<?>) field.get(entity);
          Object[] maps = new Object[list.size()];
          propMap.put(c4CAnnotation.name(), maps);
          if (((Class<?>) ((ParameterizedType) field.getGenericType()).getActualTypeArguments()[0])
              .getSuperclass().equals(C4CEntity.class)) {
            List<C4CEntity> aip = (List<C4CEntity>) list;
            for (int i = 0; i < aip.size(); i++) {
              maps[i] = serializeC4CEntity(aip.get(i));
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
    return "/Date(" + time.toEpochSecond(ZoneOffset.of("CET")) + ")/";
  }
}
