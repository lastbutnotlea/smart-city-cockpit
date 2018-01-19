package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.config.AppConfiguration;
import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.Announcement;
import java.util.List;
import java.util.stream.Collectors;
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

  @Autowired
  public AnnouncementController(BaseData<Announcement> announcementBaseData) {
    data = announcementBaseData;
  }

  @GetMapping
  public List<Announcement> getAllAnnouncements() {
    return data.getData();
  }

  @GetMapping("/stop/{stopId}")
  public List<Announcement> getAnnouncements(@PathVariable String stopId) {
    return data.getData().stream()
        .filter(a -> a.getStops().stream().anyMatch(s -> s.getId().equals(stopId)))
        .collect(Collectors.toList());
  }

  @PostMapping
  public String addAnnouncement(@RequestBody Announcement announcement) {
    return makeIdToJSON(addObject(announcement));
  }

  @DeleteMapping("/{id}")
  public String deleteAnnouncement(@PathVariable String id) {
    return makeIdToJSON(deleteObject(id));
  }

  @PutMapping
  public String editAnnouncement(@RequestBody Announcement announcement) {
    return makeIdToJSON(editObject(announcement));
  }
}
