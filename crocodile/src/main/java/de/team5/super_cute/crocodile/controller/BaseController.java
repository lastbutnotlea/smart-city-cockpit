package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.net.URI;
import org.springframework.http.ResponseEntity;

abstract class BaseController<T extends IdentifiableObject> {

  BaseData<T> data;

  T getObjectForId(String id) {
    return data.getData().stream().filter(l -> l.getId().equals(id)).findAny().orElse(null);
  }

  ResponseEntity addObject(T input) {
    boolean created = data.addObject(input);
    if (created) {
      return ResponseEntity.created(URI.create(input.getId())).build();
    }
    return ResponseEntity.badRequest().build();
  }

  ResponseEntity deleteObject(String id) {
    boolean removed = data.deleteObject(id);
    if (removed) {
      return ResponseEntity.ok().build();
    }
    return  ResponseEntity.badRequest().build();
  }

  ResponseEntity editObject(T input) {
    data.deleteObject(input.getId());
    data.addObject(input);
    return ResponseEntity.ok().build();
  }

}
