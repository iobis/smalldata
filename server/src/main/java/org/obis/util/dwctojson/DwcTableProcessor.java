package org.obis.util.dwctojson;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.io.Resources;

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

  List<Object> mapCsv(List<Object> readAll) {
    var expectedMaxCount = 2000.0;
    var elementCount = readAll.size();
    var elementChance = Math.min(expectedMaxCount / elementCount, 1.0);
    var rand = new Random();

    return readAll.stream()
      .filter(o -> rand.nextDouble() < elementChance)
      .map(Map.class::cast)
      .map(record -> {
        var tableNamespaceMapper = new TableNamespaceMapper(record);
        return Map.of(
          "id", record.get("id"),
          "purl", tableNamespaceMapper.mapTableNamespace("purl",
            keyCollections.colHeaderNamespaces.get("purl"),
            record::containsKey),
          "tdwg", tableNamespaceMapper.mapTableNamespace("tdwg",
            record.keySet()));
      })
      .collect(Collectors.toList());
  }

  List<Object> processDwcFile(final String dwcFile) {
    var table = Resources.getResource(dwcFile);
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
      error(Arrays.stream(e.getStackTrace())
        .map(StackTraceElement::toString)
        .collect(Collectors.joining("\n\t")));
      return null;
    }
  }
}
