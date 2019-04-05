package org.obis.util;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.google.common.io.Resources;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.apache.commons.io.FileUtils;
import org.obis.smalldata.db.SecureRandomId;
import org.obis.smalldata.db.model.DataSet;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.AbstractMap;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.error;

public class DwcToJsonConverter {

  public static final String DWC_OCCURRENCE = "occurrence";
  public static final String DWC_MOF = "emof";
  private static CsvMapper csvMapper = new CsvMapper();

  private DwcToJsonConverter() { }

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
          dwcTableProcessor.processDwcFile(((JsonObject) table.getValue()).getString("resource"))));
    return dwcDataset;
  }

  static Map<String, Map<String, String>> tableConfigGenerator(Map<String, String> tables) {
    return tables.entrySet().stream()
      .map(entry -> new AbstractMap.SimpleEntry<>(
        entry.getKey(), Map.of("resource", "mockdata/dwc/" + entry.getValue())))
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  public static void main(String[] args) {
    var randomId = SecureRandomId.INSTANCE;
    var dwcaConfig = new JsonObject()
      .put("output", "./server/src/main/resources/mockdata/dwcarecords.json")
      .put("datasets", new JsonArray()
        .add(JsonObject.mapFrom(
          new DataSet(randomId.generate(), "wEaBfmFyQhYCdsk", "event",
            DwcToJsonConverter.tableConfigGenerator(
              Map.of("event", "ware_hosono-v1.5/event.txt",
                DWC_OCCURRENCE, "ware_hosono-v1.5/occurrence.txt",
                DWC_MOF, "ware_hosono-v1.5/emof.txt")))))
        .add(JsonObject.mapFrom(
          new DataSet(randomId.generate(), "ntDOtUc7XsRrIus", DWC_OCCURRENCE,
            DwcToJsonConverter.tableConfigGenerator(
              Map.of(DWC_OCCURRENCE, "benthos_azov_sea_1935-v1.1/occurrence.txt",
                DWC_MOF, "benthos_azov_sea_1935-v1.1/emof.txt")))))
        .add(JsonObject.mapFrom(
          new DataSet(randomId.generate(), "NnqVLwIyPn-nRkc", DWC_OCCURRENCE,
            DwcToJsonConverter.tableConfigGenerator(
              Map.of(DWC_OCCURRENCE, "benthic_data_sevastopol-v1.1/occurrence.txt",
                DWC_MOF, "benthic_data_sevastopol-v1.1/emof.txt")))))
        .add(JsonObject.mapFrom(
          new DataSet(randomId.generate(), "PoJnGNMaxsupE4w", DWC_OCCURRENCE,
            DwcToJsonConverter.tableConfigGenerator(
              Map.of(DWC_OCCURRENCE, "deepsea_antipatharia-v1.1/occurrence.txt")))))
      );
    DwcToJsonConverter converter = new DwcToJsonConverter();
    File output = new File(dwcaConfig.getString("output"));

    JsonArray jsonDatasets = new JsonArray();
    dwcaConfig.getJsonArray("datasets").stream()
      .map(JsonObject.class::cast)
      .map(converter::convert)
      .forEach(jsonDatasets::add);

    try {
      FileUtils.writeStringToFile(output, jsonDatasets.encodePrettily(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      error(e.getStackTrace());
    }
  }

  static class DwcTableProcessor {

    List<Object> mapCsv(List<Object> readAll) {
      var expectedMaxCount = 2000.0;
      var elementCount = readAll.size();
      var elementChance = Math.min(expectedMaxCount / elementCount, 1.0);
      var rand = new Random();

      var colHeaderNamespaces = Map.of(
        "purl", List.of("type", "modified", "bibliographicCitation", "references")
      );

      return readAll.stream()
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
              .filter(k -> !((String) record.get(k)).isBlank())
              .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)),
            "tdwg", record.keySet().stream()
              .filter(key -> !specificNamespaceCols.contains(key))
              .filter(k -> !((String) record.get(k)).isBlank())
              .collect(Collectors.<String, String, Object>toMap(Function.identity(), record::get)));
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
}
