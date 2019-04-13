package org.obis.util.dwctojson;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.Value;
import org.apache.commons.io.FileUtils;
import org.obis.smalldata.db.model.DataSetConfig;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import static org.obis.smalldata.db.SecureRandomId.generateId;
import static org.pmw.tinylog.Logger.error;

public class DwcToJsonConverter {

  private static final String DWC_OCCURRENCE = "occurrence";
  private static final String DWC_EMOF = "emof";
  private static final String DWC_EVENT = "event";

  private DwcToJsonConverter() {
  }

  public static void main(String[] args) {
    var dwcaConfig = new DwcaConfig("./server/src/main/resources/demodata/dwcarecords.json",
      List.of(
        new DataSetConfig(generateId(), "wEaBfmFyQhYCdsk", "event",
          DwcToJsonConverter.tableConfigGenerator(
            Map.of(
              DWC_EVENT, new DwcTableConfig("ware_hosono-v1.5/event.txt"),
              DWC_OCCURRENCE, new DwcTableConfig("ware_hosono-v1.5/occurrence.txt"),
              DWC_EMOF, new DwcTableConfig("ware_hosono-v1.5/emof.txt")))),
        new DataSetConfig(generateId(), "ntDOtUc7XsRrIus", DWC_OCCURRENCE,
          DwcToJsonConverter.tableConfigGenerator(
            Map.of(
              DWC_OCCURRENCE, new DwcTableConfig("benthos_azov_sea_1935-v1.1/occurrence.txt"),
              DWC_EMOF, new DwcTableConfig("benthos_azov_sea_1935-v1.1/emof.txt")))),
        new DataSetConfig(generateId(), "NnqVLwIyPn-nRkc", DWC_OCCURRENCE,
          DwcToJsonConverter.tableConfigGenerator(
            Map.of(
              DWC_OCCURRENCE, new DwcTableConfig("benthic_data_sevastopol-v1.1/occurrence.txt"),
              DWC_EMOF, new DwcTableConfig("benthic_data_sevastopol-v1.1/emof.txt")))),
        new DataSetConfig(generateId(), "PoJnGNMaxsupE4w", DWC_OCCURRENCE,
          DwcToJsonConverter.tableConfigGenerator(
            Map.of(DWC_OCCURRENCE, new DwcTableConfig("deepsea_antipatharia-v1.1/occurrence.txt"))))
      ));

    var datasets = new JsonArray();
    var converter = new DwcToJsonConverter();
    var outputFile = dwcaConfig.getOutputFile();
    dwcaConfig.getDatasets().stream()
      .map(converter::convert)
      .forEach(datasets::addAll);
    writeToFile(outputFile, datasets);
  }

  private JsonArray convert(DataSetConfig config) {
    var dwcDataset = new JsonObject()
      .put("dataset_ref", config.getDatasetRef());
    var records = new ArrayList<JsonObject>();
    var dwcTables = config.getTables();
    var dwcTableProcessor = new DwcTableProcessor();
    var rand = new Random();
    var userRefs = List.of("ovZTtaOJZ98xDDY", "FsfEMwhUTO_8I68");
    var userRecords = new HashMap<String, String>();
    dwcTables.entrySet()
      .forEach(table ->
        records.addAll(
          dwcTableProcessor.processDwcFile(table.getValue()).stream()
            .map(data -> {
              var dwcaId = data.getString("id");
              if (!userRecords.containsKey(dwcaId)) {
                userRecords.put(dwcaId, userRefs.get(rand.nextInt(userRefs.size())));
              }
              return new JsonObject()
                .mergeIn(dwcDataset)
                .put("_ref", generateId())
                .put("user_ref", userRecords.get(dwcaId))
                .put("dwcTable", table.getKey())
                .put("dwcRecord", data);
            })
            .collect(Collectors.toList())));

    return new JsonArray(records);
  }

  private static Map<String, Map<String, Object>> tableConfigGenerator(Map<String, DwcTableConfig> tables) {
    return tables.entrySet().stream()
      .map(entry -> new AbstractMap.SimpleEntry<String, Map<String, Object>>(
        entry.getKey(), Map.of("resource", "demodata/dwc/" + entry.getValue().getResource())))
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private static void writeToFile(String filename, JsonArray dataset) {
    var outputFile = new File(filename);
    try {
      FileUtils.writeStringToFile(outputFile, dataset.encodePrettily(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      error(e.getStackTrace());
    }
  }

  @Value
  private static class DwcaConfig {
    private final String outputFile;
    private final List<DataSetConfig> datasets;
  }

  @Value
  private static class DwcTableConfig {
    private final String resource;
  }
}
