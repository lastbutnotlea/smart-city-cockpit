package de.team5.super_cute.crocodile.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.team5.super_cute.crocodile.external.C4CProperty;

public class C4CNotes extends C4CEntity{

  @C4CProperty(name = "Text")
  private String text;

  @C4CProperty(name = "TypeCode", maxLength = 5)
  @JsonIgnore
  private String typeCode = "10002"; // Textkörper

  public C4CNotes() {
  }

  public C4CNotes(String text) {
    this.text = text;
  }

  @Override
  public String getCollectionName() {
    return "AppointmentNotesCollection";
  }

  @Override
  public C4CEntity getEmptyObject() {
    return new C4CNotes();
  }
}
