package de.team5.super_cute.crocodile.jsonclasses;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class LiveDataConfiguration {

  public int defectChance;
  public int defectRemoveChance;
  public int feedbackChance;

  public LiveDataConfiguration() {
  }

  public LiveDataConfiguration(int defectChance, int defectRemoveChance, int feedbackChance) {
    this.defectChance = defectChance;
    this.defectRemoveChance = defectRemoveChance;
    this.feedbackChance = feedbackChance;
  }

  @Override
  public String toString() {
    return new ToStringBuilder(this)
        .append("defectChance", defectChance)
        .append("defectRemoveChance", defectRemoveChance)
        .append("feedbackChance", feedbackChance)
        .toString();
  }
}
