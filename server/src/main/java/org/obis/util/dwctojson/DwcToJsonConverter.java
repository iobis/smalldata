package org.obis.util.dwctojson;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.apache.commons.io.FileUtils;
import org.obis.smalldata.db.SecureRandomId;
import org.obis.smalldata.db.model.DataSet;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.AbstractMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.error;

public class DwcToJsonConverter {

  public static final String DWC_OCCURRENCE = "occurrence";
  public static final String DWC_MOF = "emof";

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
      .put("outputDir", "./server/src/main/resources/mockdata/dwcarecords/")
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
    dwcaConfig.getJsonArray("datasets").stream()
      .map(JsonObject.class::cast)
      .map(converter::convert)
      .forEach(dataset -> {
        var ref = dataset.getString("dataset_ref");
        writeToFile(dwcaConfig.getString("outputDir") + ref + ".json ", dataset);
      });
  }

  static void writeToFile(String filename, JsonObject dataset) {
    File outputFile = new File(filename);
    try {
      FileUtils.writeStringToFile(outputFile, dataset.encodePrettily(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      error(e.getStackTrace());
    }
  }

}
