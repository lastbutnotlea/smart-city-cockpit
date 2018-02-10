package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.AnnouncementData;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.Announcement;
import de.team5.super_cute.crocodile.util.Helpers;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/announcement")
public class AnnouncementController extends BaseController<Announcement> {

  private static final Logger logger = LoggerFactory.getLogger(AnnouncementController.class);

  @Autowired
  public AnnouncementController(BaseData<Announcement> announcementBaseData) {
    data = announcementBaseData;
  }

  @GetMapping
  public List<Announcement> getAllAnnouncements() {
    logger.info("Got Request to return all Announcements");
    return data.getData();
  }

  @GetMapping("/stop/{stopId}")
  public List<Announcement> getAnnouncements(@PathVariable String stopId) {
    logger.info("Got Request to return all Announcements for Stop with id " + stopId);
    return ((AnnouncementData) data).getAnnouncementsForStopId(stopId);
  }

  @PostMapping
  public String addAnnouncement(@RequestBody Announcement announcement) {
    logger.info("Got Request to add Announcement " + announcement);
    return Helpers.makeIdToJSON(addObject(announcement));
  }

  @DeleteMapping("/{id}")
  public String deleteAnnouncement(@PathVariable String id) {
    logger.info("Got Request to delete Announcement with id " + id);
    return Helpers.makeIdToJSON(deleteObject(id));
  }

  @PutMapping
  public String editAnnouncement(@RequestBody Announcement announcement) {
    logger.info("Got Request to edit Announcement " + announcement);
    return Helpers.makeIdToJSON(editObject(announcement));
  }
}
