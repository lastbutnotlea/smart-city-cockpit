package de.team5.super_cute.crocodile.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.IntNode;
import java.awt.Color;
import java.io.IOException;

public class ColorDeserializer extends JsonDeserializer<Color> {
  @Override
  public Color deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    TreeNode root = p.getCodec().readTree(p);
    IntNode rgba = (IntNode) root.get("rgb");
    return new Color(rgba.intValue(), false);
  }
}
