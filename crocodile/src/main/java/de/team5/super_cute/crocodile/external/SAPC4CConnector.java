package de.team5.super_cute.crocodile.external;

import static de.team5.super_cute.crocodile.util.Helpers.getC4CProperties;

import de.team5.super_cute.crocodile.model.c4c.C4CEntity;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.springframework.beans.factory.annotation.Autowired;
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
  private static final String FILTER_QUERY = "?$filter=CreatedBy%20eq%20%27Uni%20Augsburg02%27";
  private final String boundary = "batch_" + UUID.randomUUID().toString();
  private static final Logger logger = LoggerFactory.getLogger(SAPC4CConnector.class);
  private HttpClient httpClient = null;
  private Edm metadataDefinition = null;
  private String csrfToken = null;
  private CookieStore cookieStore = null;
  private SAPC4CSerializer serializer;

  @Autowired
  public SAPC4CConnector(SAPC4CSerializer serializer) {
    this.serializer = serializer;
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

    if (!response.getStatusLine().toString().equals("HTTP/1.1 200 OK")) {
      logger.error("Error from Get Request to SAP C4C: " + response.getStatusLine());
    }

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
  public List<Event> getEvents()
      throws EntityProviderException, EdmException, IOException {
    logger.info("Getting all Appointments from C4C");
    List<Event> events = getC4CEntities(new Event()).stream().filter(Event.class::isInstance)
        .map(Event.class::cast)
        .collect(
            Collectors.toList());
    logger.info("Received all Appointments from C4C");
    return events;
  }

  /**
   * Collects all Service Requests from the SAP C4C System.
   */
  public List<ServiceRequest> getServiceRequests()
      throws EntityProviderException, EdmException, IOException {
    logger.info("Getting all Service Requests from C4C");
    List<ServiceRequest> serviceRequests = getC4CEntities(new ServiceRequest()).stream().filter(ServiceRequest.class::isInstance)
        .map(ServiceRequest.class::cast).collect(
            Collectors.toList());
    logger.info("Received all Service Requests from C4C");
    return serviceRequests;
  }

  /**
   * @return Collects all items of the Type corresponding to T from the SAP C4C System
   */
  public List<C4CEntity> getC4CEntities(C4CEntity exampleEntity)
      throws EntityProviderException, EdmException, IOException {
    List<C4CEntity> items = new ArrayList<>();

    // find associated objects to expand
    StringBuilder expandOptions = new StringBuilder();
    expandOptions.append("&$expand=");
    getC4CProperties(exampleEntity)
        .filter(f -> f.getAnnotation(C4CProperty.class).hasAssociatedEntities())
        .map(f -> f.getAnnotation(C4CProperty.class).name()).forEach(s -> {
      expandOptions.append(s);
      expandOptions.append(",");
    });
    int lastCommaIndex = expandOptions.lastIndexOf(",");
    if (lastCommaIndex == expandOptions.length() - 1) {
      expandOptions.replace(lastCommaIndex, lastCommaIndex + 1, "");
    }

    ODataFeed feed = readFeed(BASE_URL, exampleEntity.getCollectionName(),
        FILTER_QUERY + expandOptions.toString());
    for (ODataEntry entry : feed.getEntries()) {
      items.add(serializer.mapEntryToC4CEntity(entry, exampleEntity.getEmptyObject()));
    }

    return items;
  }

  /**
   * @param entity Is written into the SAP C4C System.
   * @return "Success" or "Failure
   */
  public String putC4CEntity(C4CEntity entity, String method)
      throws IOException, BatchException {
    List<BatchPart> batchParts = new ArrayList<>();

    BatchChangeSet changeSet = BatchChangeSet.newBuilder().build();
    String contentId = UUID.randomUUID().toString();

    Map<String, String> changeSetHeaders = new HashMap<>();
    changeSetHeaders.put(CONTENT_TYPE_HEADER, CONTENT_TYPE);
    changeSetHeaders.put(CONTENT_ID_HEADER, contentId);
    changeSetHeaders.put(ACCEPT_HEADER, CONTENT_TYPE);

    BatchChangeSetPart changeRequest = BatchChangeSetPart.method(method)
        .uri(entity.getCollectionName()).body(serializer.serializeC4CEntityToString(entity))
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
}
