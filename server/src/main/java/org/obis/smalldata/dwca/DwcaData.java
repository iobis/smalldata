package org.obis.smalldata.dwca;

import io.vertx.core.json.JsonObject;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.debug;

class DwcaData {

  private DwcaData() {
  }

  static Map<String, List<JsonObject>> datasetToDwcaMap(List<JsonObject> dataset) {
    var dwcaMap = dataset.stream()
      .map(JsonObject.class::cast)
      .collect(Collectors.groupingBy(dwcaEntry -> dwcaEntry.getString("dwcTable")))
      .entrySet().stream()
      .map(DwcaData::newDwcRecord)
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    debug("generated dwc tables: {} ", dwcaMap);
    return dwcaMap;
  }

  private static Map.Entry<String, List<JsonObject>> newDwcRecord(Map.Entry<String, List<JsonObject>> table) {
    var key = table.getKey();
    var value = table.getValue().stream()
      .map(dwcEntry -> dwcEntry.getJsonObject("dwcRecord"))
      .map(DwcaData::flattenDwcFields)
      .collect(Collectors.toList());
    return Map.entry(key, value);
  }

  private static JsonObject flattenDwcFields(JsonObject dwcRecord) {
    var id = dwcRecord.getString("id");
    return dwcRecord.stream()
      .filter(ns -> !"id".equals(ns.getKey()))
      .filter(ns -> !((JsonObject) ns.getValue()).isEmpty())
      .map(DwcaData::mapNsFields)
      .map(entry -> new JsonObject().put("id", id).mergeIn(entry))
      .reduce(JsonObject::mergeIn)
      .get();
  }

  private static JsonObject mapNsFields(Map.Entry<String, Object> nsFields) {
    var ns = nsFields.getKey();
    return ((JsonObject) nsFields.getValue()).stream()
      .map(header -> new JsonObject().put(ns + "/" + header.getKey(), header.getValue()))
      .collect(JsonObject::new, JsonObject::mergeIn, JsonObject::mergeIn);
  }
}
