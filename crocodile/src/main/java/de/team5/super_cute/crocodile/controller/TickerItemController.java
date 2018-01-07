package de.team5.super_cute.crocodile.controller;

import static de.team5.super_cute.crocodile.config.TickerConfig.ITEM_COUNT;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.TickerItem;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ticker")
public class TickerItemController extends BaseController<TickerItem> {

  private Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired
  public TickerItemController(BaseData<TickerItem> tickerItemBaseData) {
    data = tickerItemBaseData;
  }

  @GetMapping
  public List<TickerItem> getTickerItems() {
    logger.info("Got Request to return tickerItems");
    List<TickerItem> list = data.getData();
    return list.stream()
        .sorted((t, u) -> Integer.compare(u.getItem().getItemPriority(), t.getItem().getItemPriority()))
        .collect(Collectors.toList()).subList(0, Integer.min(ITEM_COUNT - 1, list.size()));
  }
}
