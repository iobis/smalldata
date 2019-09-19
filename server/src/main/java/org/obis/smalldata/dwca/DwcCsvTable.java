package org.obis.smalldata.dwca;

import static org.pmw.tinylog.Logger.error;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.base.Splitter;
import com.google.common.base.Throwables;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;
import io.vertx.core.json.JsonObject;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

class DwcCsvTable {

  private static final ObjectWriter DEFAULT_OBJECT_WRITER =
      new CsvMapper()
          .enable(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE)
          .enable(CsvParser.Feature.INSERT_NULLS_FOR_MISSING_COLUMNS)
          .configure(JsonGenerator.Feature.IGNORE_UNKNOWN, true)
          .writer();

  private final ObjectWriter objectWriter;

  DwcCsvTable() {
    this(DEFAULT_OBJECT_WRITER);
  }

  private DwcCsvTable(ObjectWriter objectWriter) {
    this.objectWriter = objectWriter;
  }

  void writeTableToFile(List<JsonObject> dwcTable, File file) {
    var csvSchemaBuilder =
        CsvSchema.builder().setUseHeader(true).setColumnSeparator('\t').disableQuoteChar();
    var headers = DwcCsvTable.extractHeaders(dwcTable);
    headers.forEach(csvSchemaBuilder::addColumn);
    try {
      objectWriter
          .with(csvSchemaBuilder.build())
          .writeValue(file, dwcTable.stream().map(JsonObject::getMap).collect(Collectors.toList()));
    } catch (IOException e) {
      error(Throwables.getStackTraceAsString(e));
    }
  }

  static Set<String> extractHeaders(List<JsonObject> dwcRecords) {
    return dwcRecords
        .stream()
        .map(JsonObject::fieldNames)
        .collect(LinkedHashSet::new, Set<String>::addAll, Set<String>::addAll);
  }

  static Set<String> headersFromFile(File file) throws IOException {
    var actualLines = Files.lines(file.toPath());
    var splitter = Splitter.on('.').trimResults();
    return Sets.newHashSet(actualLines.findFirst().get().split("\t"))
        .stream()
        .map(h -> Iterables.getLast(splitter.split(h)))
        .collect(Collectors.toSet());
  }
}
