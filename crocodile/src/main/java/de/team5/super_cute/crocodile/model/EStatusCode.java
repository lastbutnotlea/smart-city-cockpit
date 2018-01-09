package de.team5.super_cute.crocodile.model;

public enum EStatusCode {
  OPEN("Open", 1),
  IN_PROCESS("In Process", 2),
  CUSTOMER_ACTION("Customer Action", 4),
  COMPLETED("Completed", 5),
  CLOSED("Closed", 6);

  private final String text;
  private final int value;
  EStatusCode(String text, int value) {
    this.text = text;
    this.value = value;
  }

  public String getText() {
    return text;
  }

  public int getValue() {
    return value;
  }
}
