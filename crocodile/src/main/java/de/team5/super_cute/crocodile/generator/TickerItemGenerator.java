package de.team5.super_cute.crocodile.generator;

import static de.team5.super_cute.crocodile.config.TickerConfig.EVENT_COUNT;
import static de.team5.super_cute.crocodile.config.TickerConfig.ITEM_COUNT;
import static de.team5.super_cute.crocodile.config.TickerConfig.STOP_COUNT;
import static de.team5.super_cute.crocodile.config.TickerConfig.UPDATE_FREQUENCY;
import static de.team5.super_cute.crocodile.config.TickerConfig.VEHICLE_COUNT;

import de.team5.super_cute.crocodile.data.FeedbackData;
import de.team5.super_cute.crocodile.data.StopData;
import de.team5.super_cute.crocodile.data.TickerItemData;
import de.team5.super_cute.crocodile.data.VehicleData;
import de.team5.super_cute.crocodile.model.EState;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.Stateable;
import de.team5.super_cute.crocodile.model.TickerItem;
import de.team5.super_cute.crocodile.model.TickerItemable;
import de.team5.super_cute.crocodile.model.Vehicle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TickerItemGenerator {

  @Autowired
  private TickerItemData tickerItemData;
  @Autowired
  private VehicleData vehicleData;
  @Autowired
  private StopData stopData;
  @Autowired
  private FeedbackData feedbackData;

  private SeverityComparator severityComparator = new SeverityComparator();

  @Scheduled(fixedDelay = UPDATE_FREQUENCY, initialDelay = 4000)
  public void generateTickerItems() {
    LoggerFactory.getLogger(getClass())
        .info("Started generating TickerItems");
    //wip
    List<Event> eventData = new ArrayList<>();

    //delete all TickerItems
    for (TickerItem tickerItem : tickerItemData.getData()) {
      tickerItemData.deleteObject(tickerItem.getId());
    }
    //add events
    int counter = 0;
    for (Event event : eventData) {
      tickerItemData.addObject(new TickerItem(event));
      counter++;
      if (counter == EVENT_COUNT) {
        break;
      }
    }
    addTickerItems(vehicleData.getData().stream()
        .filter(v -> v.getState() == EState.CRITICAL)
        .sorted((a, b) -> severityComparator.compare(a, b))
        .collect(Collectors.toList()), VEHICLE_COUNT);
    addTickerItems(stopData.getData().stream()
        .filter(s -> s.getState() == EState.CRITICAL)
        .sorted((a, b) -> severityComparator.compare(a, b))
        .collect(Collectors.toList()), STOP_COUNT);
    addTickerItems(feedbackData.getData().stream()
        .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
        .collect(Collectors.toList()), (ITEM_COUNT * 2) - tickerItemData.getData().size());
    LoggerFactory.getLogger(getClass())
        .info("Finished generating TickerItems");
  }

  private int addTickerItems(List<TickerItemable> data, int count) {
    int counter = 0;
    for (TickerItemable item : data) {
      tickerItemData.addObject(new TickerItem(item));
      counter++;
      if (counter == count) {
        break;
      }
    }
    return counter;
  }

  private class SeverityComparator implements Comparator<Stateable> {

    @Override
    public int compare(Stateable o1, Stateable o2) {
      return Integer.compare(o1.getSeverity(), o2.getSeverity());
    }
  }
}
