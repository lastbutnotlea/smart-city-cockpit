package de.team5.super_cute.crocodile.jsonclasses;

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
}
