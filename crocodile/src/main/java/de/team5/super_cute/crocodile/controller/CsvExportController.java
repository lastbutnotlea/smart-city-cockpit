package de.team5.super_cute.crocodile.controller;

import com.opencsv.CSVWriter;
import de.team5.super_cute.crocodile.config.AppConfiguration;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfiguration.API_PREFIX + "/export")
public class CsvExportController {

  private DataSource dataSource;

  @Autowired
  public CsvExportController(DataSource dataSourceExport) {
    this.dataSource = dataSourceExport;
  }

  @GetMapping("/vehicles")
  public String exportVehicles() throws IOException, SQLException {
    return exportTable("vehicle");
  }

  @GetMapping("/announcement")
  public String exportAnnouncements() throws IOException, SQLException {
    return exportTable("announcement");
  }

  private String exportTable(String tablename) throws IOException, SQLException {
    StringWriter s = new StringWriter();
    CSVWriter writer = new CSVWriter(s, ',', CSVWriter.NO_QUOTE_CHARACTER,
        CSVWriter.NO_ESCAPE_CHARACTER,
        CSVWriter.DEFAULT_LINE_END);
    ResultSet myResultSet = dataSource.getConnection().prepareStatement("select * from " + tablename).executeQuery();
    writer.writeAll(myResultSet, true);
    writer.close();
    return s.toString();
  }

}
