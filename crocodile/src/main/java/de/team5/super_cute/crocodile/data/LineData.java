package de.team5.super_cute.crocodile.data;

import de.team5.super_cute.crocodile.model.Line;
import org.springframework.stereotype.Service;

@Service
public class LineData extends BaseData<Line> {

  public LineData() {
    super(Line.class);
  }

}
