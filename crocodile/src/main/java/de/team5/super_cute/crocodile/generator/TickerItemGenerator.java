package de.team5.super_cute.crocodile.generator;

import static de.team5.super_cute.crocodile.config.AppConfiguration.TIMEZONE;
import static de.team5.super_cute.crocodile.config.C4CConfig.EVENT_TEST_LOCATION_NAME;
import static de.team5.super_cute.crocodile.config.TickerConfig.ITEM_COUNT;
import static de.team5.super_cute.crocodile.config.TickerConfig.STOP_COUNT;
import static de.team5.super_cute.crocodile.config.TickerConfig.TICKER_FREQUENCY;
import static de.team5.super_cute.crocodile.config.TickerConfig.VEHICLE_COUNT;
import static java.lang.Math.max;

import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.LineData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TripData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Line;
import de.team5.super_cute.crocodile.model.Stateable;
import de.team5.super_cute.crocodile.model.TickerItem;
import de.team5.super_cute.crocodile.model.TickerItemable;
import de.team5.super_cute.crocodile.model.Trip;
import de.team5.super_cute.crocodile.util.Helpers;
import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TickerItemGenerator {

  private static final Logger logger = LoggerFactory.getLogger(TickerItemGenerator.class);

  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private StopData stopData;
  @Autowired
  private FeedbackData feedbackData;
  @Autowired
  private TripData tripData;
  @Autowired
  private LineData lineData;
  @Autowired
  private SAPC4CConnector sapc4CConnector;

  private SeverityComparator severityComparator = new SeverityComparator();

  private List<TickerItem> cachedItems = new ArrayList<>();
  private List<TickerItem> newTickerItems = new ArrayList<>();
  private List<String> removedTickerItemObjectiveIds = new ArrayList<>();

  public List<TickerItem> getTickerItems() {
    return cachedItems;
  }

  public void deleteTickerItem(String tickerItemId) {
    String tickerItemObjectId = cachedItems.stream()
        .filter(ti -> ti.getItem().getId().equals(tickerItemId))
        .map(ti -> ti.getItem().getId())
        .findAny().orElse("");
    if (!tickerItemObjectId.isEmpty()) {
      removedTickerItemObjectiveIds.add(tickerItemObjectId);
      cachedItems = cachedItems.stream()
          .filter(ti -> !removedTickerItemObjectiveIds.contains(ti.getItem().getId()))
          .collect(Collectors.toList());
    }
  }

  @Scheduled(fixedDelay = TICKER_FREQUENCY, initialDelay = 4000)
  public void generateTickerItems() {
    logger.info("Started generating TickerItems");

    try {
      addTickerItems(sapc4CConnector.getEvents().stream()
          .filter(e ->
              // filter out test case events, location name is never set through our gui
              !e.getLocationName().equals(EVENT_TEST_LOCATION_NAME)
                  && e.getStartTime().isAfter(LocalDateTime.now(TIMEZONE).minusHours(2))
                  && e.getEndTime().isBefore(LocalDateTime.now(TIMEZONE).plusHours(2)))
          .map(TickerItemable.class::cast), Integer.MAX_VALUE);
    } catch (EntityProviderException | EdmException | IOException e) {
      Helpers.logException(logger, e);
    }

    addTickerItems(vehicleData.getData().stream()
        .filter(v -> v.getState() == EState.CRITICAL)
        .sorted((a, b) -> severityComparator.compare(a, b))
        .map(TickerItemable.class::cast), VEHICLE_COUNT);

    addTickerItems(stopData.getData().stream()
        .filter(s -> s.getState() == EState.CRITICAL)
        .sorted((a, b) -> severityComparator.compare(a, b))
        .map(TickerItemable.class::cast), STOP_COUNT);

    addTickerItems(feedbackData.getData().stream()
        .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
        .map(TickerItemable.class::cast), max((ITEM_COUNT * 2) - cachedItems.size(), 0));

    // find lines that have no current trips
    List<Line> lines = lineData.getData();
    lines.removeAll(tripData.getActiveTripsWithDelay().stream()
        .map(Trip::getLine).collect(Collectors.toList()));
    addTickerItems(lines.stream().map(TickerItemable.class::cast), lines.size());

    //replace all TickerItems
    cachedItems = new ArrayList<>(newTickerItems).stream()
        .filter(ti -> !removedTickerItemObjectiveIds.contains(ti.getItem().getId()))
        .collect(Collectors.toList());
    newTickerItems.clear();

    logger.info("Finished generating TickerItems");
  }

  private void addTickerItems(Stream<TickerItemable> data, int count) {
    data.limit(count).forEach(ti -> newTickerItems.add(new TickerItem(ti)));
  }

  private static class SeverityComparator implements Comparator<Stateable>, Serializable {

    /**
     * returns objects desc by severity
     */
    @Override
    public int compare(Stateable o1, Stateable o2) {
      return Integer.compare(o2.getSeverity(), o1.getSeverity());
    }
  }
}
