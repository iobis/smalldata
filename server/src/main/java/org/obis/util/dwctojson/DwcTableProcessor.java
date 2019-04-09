package org.obis.util.dwctojson;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.io.Resources;
import io.vertx.core.json.JsonObject;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.error;

class DwcTableProcessor {

  private static CsvMapper csvMapper = new CsvMapper();
  private static KeyCollections keyCollections = KeyCollections.INSTANCE;

  List<JsonObject> processDwcFile(Map<String, Object> dwcConfig) {
    var table = Resources.getResource((String) dwcConfig.get("resource"));
    var csvSchema = CsvSchema.builder()
      .setUseHeader(true)
      .setColumnSeparator('\t')
      .build();
    try {
      List<Object> readAll = csvMapper.readerFor(Map.class)
        .with(csvSchema)
        .readValues(table)
        .readAll();
      return mapCsv(readAll);
    } catch (IOException e) {
      var errorMsg = Arrays.stream(e.getStackTrace())
        .map(StackTraceElement::toString)
        .collect(Collectors.joining("\n\t"));
      error(errorMsg);
      return null;
    }
  }

  private List<JsonObject> mapCsv(List<Object> readAll) {
    var expectedMaxCount = 2000.0;
    var elementCount = readAll.size();
    var elementChance = Math.min(expectedMaxCount / elementCount, 1.0);
    var rand = new Random();

    return readAll.stream()
      .filter(o -> rand.nextDouble() < elementChance)
      .map(Map.class::cast)
      .map(record -> {
        var tableNamespaceMapper = new TableNamespaceMapper(record);
        var id = record.get("id");
        var purl = tableNamespaceMapper.mapTableNamespace(
          "purl",
          keyCollections.colHeaderNamespaces.get("purl"),
          record::containsKey);
        var tdwg = tableNamespaceMapper.mapTableNamespace("tdwg", record.keySet());

        return Map.of("id", id, "purl", purl, "tdwg", tdwg);
      })
      .map(JsonObject::new)
      .collect(Collectors.toList());
  }
}
