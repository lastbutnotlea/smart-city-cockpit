package de.team5.super_cute.crocodile.controller;

import de.team5.super_cute.crocodile.data.BaseData;
import de.team5.super_cute.crocodile.model.IdentifiableObject;
import java.net.URI;
import org.springframework.http.ResponseEntity;

abstract class BaseController<T extends IdentifiableObject> {

  T getObjectForId(BaseData<T> data, String id) {
    return data.getData().stream().filter(l -> l.getId().equals(id)).findAny().orElse(null);
  }

  ResponseEntity addObject(BaseData<T> data, T input) {
    boolean created = data.getData().add(input);
    if (created) {
      return ResponseEntity.created(URI.create(input.getId())).build();
    }
    return ResponseEntity.badRequest().build();
  }

  ResponseEntity deleteObject(BaseData<T> data, String id) {
    boolean removed = data.getData().removeIf(t -> t.getId().equals(id));
    if (removed) {
      return ResponseEntity.ok().build();
    }
    return  ResponseEntity.badRequest().build();
  }

  ResponseEntity editObject(BaseData<T> data, T input) {
    boolean removed = data.getData().removeIf(t -> t.getId().equals(input.getId()));
    if (removed) {
      boolean added = data.getData().add(input);
      if (added) {
        return ResponseEntity.ok().build();
      }
    }
    return ResponseEntity.badRequest().build();
  }

}
