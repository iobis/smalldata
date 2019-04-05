package org.obis.util;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.io.Resources;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.apache.commons.io.FileUtils;
import org.obis.smalldata.db.SecureRandomId;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.error;

public class DwcToJsonConverter {

  private static CsvMapper csvMapper = new CsvMapper();

  private DwcToJsonConverter() { }

  static class DwcTableProcessor {
    DwcTableProcessor() { }

    List<Object> mapCsv(List<Object> readAll) {
      var expectedMaxCount = 100.0;
      var elementCount = readAll.size();
      var elementChance = Math.min(expectedMaxCount / elementCount, 1.0);
      var rand = new Random();

      var colHeaderNamespaces = Map.of(
        "purl", List.of("type", "modified", "bibliographicCitation", "references")
      );

      List<Object> result = readAll.stream()
        .filter(o -> rand.nextDouble() < elementChance)
        .map(Map.class::cast)
        .map(record -> {
          var specificNamespaceCols = colHeaderNamespaces.values().stream()
            .flatMap(List::stream)
            .collect(Collectors.toList());
          specificNamespaceCols.add("id");
          return Map.of(
            "id", record.get("id"),
            "purl", colHeaderNamespaces.get("purl").stream()
              .filter(record::containsKey)
              .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)),
            "tdwg", record.keySet().stream()
              .filter(key -> !specificNamespaceCols.contains(key))
              .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)));
        })
        .collect(Collectors.toList());

      return result;
    }

    List<Object> processDwcFile(final String dwcFile) {
      var table = Resources.getResource(dwcFile);
      var csvSchema = CsvSchema.builder()
        .setUseHeader(true)
        .setColumnSeparator('\t')
        .build();
      try {
        List<Object> readAll = csvMapper.readerFor(Map.class).with(csvSchema).readValues(table).readAll();
        return  mapCsv(readAll);
      } catch (IOException e) {
        error(e.getStackTrace());
        return null;
      }
    }
  }

  JsonObject convert(JsonObject config) {
    var dwcDataset = new JsonObject()
      .put("_ref", config.getString("_ref"))
      .put("dataset_ref", config.getString("dataset_ref"))
      .put("core", config.getString("core"));
    var dwcTables = config.getJsonObject("tables");
    var dwcTableProcessor = new DwcTableProcessor();
    dwcTables.stream()
      .forEach(table ->
        dwcDataset.put(((Map.Entry) table).getKey().toString(),
          dwcTableProcessor.processDwcFile(((JsonObject)table.getValue()).getString("resource"))));
    return dwcDataset;
  }

  public static void main(String[] args) {
    SecureRandomId randomId = SecureRandomId.INSTANCE;
    var dwcaConfig = new JsonObject()
      .put("_ref", randomId.generate())
      .put("dataset_ref", "ntDOtUc7XsRrIus")
      .put("output", "./server/src/main/resources/mockdata/dwc/benthos_azov_sea_1935-v1.1/test.json")
      .put("core", "occurence")
      .put("tables", new JsonObject()
        .put("occurrence", new JsonObject()
          .put("resource", "mockdata/dwc/benthos_azov_sea_1935-v1.1/occurrence.txt"))
        .put("emof", new JsonObject()
          .put("resource", "mockdata/dwc/benthos_azov_sea_1935-v1.1/emof.txt")));
    DwcToJsonConverter converter = new DwcToJsonConverter();
    File output = new File(dwcaConfig.getString("output"));

    JsonArray jsonDatasets = new JsonArray()
      .add(converter.convert(dwcaConfig));
    try {
      FileUtils.writeStringToFile(output, jsonDatasets.encodePrettily(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      error(e.getStackTrace());
    }
  }
}
