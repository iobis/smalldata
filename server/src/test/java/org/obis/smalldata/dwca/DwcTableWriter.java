package org.obis.smalldata.dwca;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.base.Throwables;
import io.vertx.core.json.JsonObject;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.error;

public class DwcTableWriter {
  private final ObjectWriter csvMapper = new CsvMapper()
    .enable(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE)
    .enable(CsvParser.Feature.INSERT_NULLS_FOR_MISSING_COLUMNS)
    .configure(JsonGenerator.Feature.IGNORE_UNKNOWN, true)
    .writer();
  private final DwcCsvGenerator csvGenerator;

  public DwcTableWriter(DwcCsvGenerator csvGenerator) {
    this.csvGenerator = csvGenerator;
  }

  File writeTableToFile(Map.Entry<String, List<JsonObject>> dwcTable) {
    var csvSchema = CsvSchema.builder()
      .setUseHeader(true)
      .setColumnSeparator('\t')
      .disableQuoteChar();
    var headers = csvGenerator.extractHeaders(dwcTable.getValue());
    var tableName = dwcTable.getKey();
    headers.stream().forEach(csvSchema::addColumn);
    try {
      var file = File.createTempFile("obis-iode", tableName + ".txt");
      csvMapper.with(csvSchema.build())
        .writeValue(file, dwcTable.getValue().stream()
          .map(JsonObject::getMap)
          .collect(Collectors.toList()));
      return file;
    } catch (IOException e) {
      error(Throwables.getStackTraceAsString(e));
      return null;
    }
  }
}
