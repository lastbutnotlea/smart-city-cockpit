package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.IdentifiableObject;

abstract class BaseController<T extends IdentifiableObject> {

  BaseData<T> data;

  T getObjectForId(String id) {
    return data.getData().stream().filter(l -> l.getId().equals(id)).findAny().orElse(null);
  }

  String addObject(T input) {
    data.addObject(input);
    return input.getId();
  }

  String deleteObject(String id) {
    data.deleteObject(id);
    return id;
  }

  String editObject(T input) {
    data.deleteObject(input.getId());
    data.addObject(input);
    return input.getId();
  }

  String makeIdToJSON(String id) {
    return "{\"id\":\"" + id + "\"}";
  }
}
