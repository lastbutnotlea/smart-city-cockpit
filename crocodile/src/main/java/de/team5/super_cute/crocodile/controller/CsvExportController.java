package de.team5.super_cute.crocodile.controller;

import com.opencsv.CSVWriter;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/export")
public class CsvExportController {

  private static final Logger logger = LoggerFactory.getLogger(CsvExportController.class);

  private DataSource dataSource;

  @Autowired
  public CsvExportController(DataSource dataSourceExport) {
    this.dataSource = dataSourceExport;
  }

  @GetMapping("/vehicles")
  public String exportVehicles() throws IOException, SQLException {
    logger.info("Got Request to export vehicles");
    return exportTable(
        "select vehicle.*, string_agg(defects, '; ') as defects "
            + "from vehicle left outer join vehicle_defects "
            + "on vehicle_id = vehicle.id "
            + "group by vehicle.id");
  }

  @GetMapping("/announcements")
  public String exportAnnouncements() throws IOException, SQLException {
    logger.info("Got Request to export announcements");
    return exportTable("select announcement.*, string_agg(stop.commonname, '; ') as stops "
        + "from announcement left outer join announcement_stop a_s "
        + "on a_s.announcement_id = announcement.id "
        + "join stop "
        + "on a_s.stops_id = stop.id "
        + "group by announcement.id");
  }

  private String exportTable(String sql) throws IOException, SQLException {
    StringWriter s = new StringWriter();
    CSVWriter writer = new CSVWriter(s, ',', CSVWriter.NO_QUOTE_CHARACTER,
        CSVWriter.NO_ESCAPE_CHARACTER,
        CSVWriter.DEFAULT_LINE_END);
    ResultSet myResultSet = dataSource.getConnection().prepareStatement(sql).executeQuery();
    writer.writeAll(myResultSet, true);
    writer.close();
    return s.toString();
  }

}
