package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.TickerConfig.ITEM_COUNT;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.generator.TickerItemGenerator;
import de.team5.super_cute.crocodile.model.TickerItem;
import de.team5.super_cute.crocodile.util.Helpers;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/ticker")
public class TickerItemController{

  private static final Logger logger = LoggerFactory.getLogger(TickerItemController.class);

  @Autowired
  private TickerItemGenerator tickerItemGenerator;

  @GetMapping
  public List<TickerItem> getTickerItems() {
    logger.info("Got Request to return tickerItems");
    List<TickerItem> list = tickerItemGenerator.getTickerItems();
    return list.stream()
        .sorted((t, u) -> Integer.compare(u.getItem().getItemPriority(), t.getItem().getItemPriority()))
        .collect(Collectors.toList()).subList(0, Integer.min(ITEM_COUNT, list.size()));
  }

  @DeleteMapping("/{id}")
  public String deleteTickerItem(@PathVariable String id) {
    logger.info("Got Request to delete the tickerItem with id " + id);
    tickerItemGenerator.deleteTickerItem(id);
    return Helpers.makeIdToJSON(id);
  }
}
