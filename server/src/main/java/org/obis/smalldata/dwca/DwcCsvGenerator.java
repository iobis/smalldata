package org.obis.smalldata.dwca;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.AbstractMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;

class DwcCsvGenerator {

  private final MongoClient mongoClient;

  DwcCsvGenerator(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  Map<String, List<JsonObject>> extractDwcRecords(List<JsonObject> dataset) {
    var dwcRecords = dataset.stream()
      .map(JsonObject.class::cast)
      .collect(Collectors.groupingBy(in -> in.getString("dwcTable")))
      .entrySet().stream()
      .map(table -> new AbstractMap.SimpleEntry(
        table.getKey(),
        table.getValue().stream()
          .map(dwcaRecord -> dwcaRecord.getJsonObject("dwcRecord"))
          .map(this::flattenDwcFields)
          .collect(Collectors.toList())))
      .collect(Collectors.toMap(Map.Entry<String, List<JsonObject>>::getKey,
        Map.Entry<String, List<JsonObject>>::getValue));
    info("Added dwc records: {} ", dwcRecords);
    return dwcRecords;
  }

  private JsonObject flattenDwcFields(JsonObject dwcRecord) {
    var id = dwcRecord.getString("id");
    return dwcRecord.stream()
      .filter(ns -> !"id".equals(ns.getKey()))
      .filter(ns -> !((JsonObject) ns.getValue()).isEmpty())
      .map(this::mapNsFields)
      .map(entry -> new JsonObject().put("id", id).mergeIn(entry))
      .reduce(JsonObject::mergeIn)
      .get();
  }

  private JsonObject mapNsFields(Map.Entry<String, Object> nsFields) {
    var ns = nsFields.getKey();
    return ((JsonObject) nsFields.getValue()).stream()
      .map(header -> new JsonObject().put(ns + "/" + header.getKey(), header.getValue()))
      .collect(JsonObject::new, JsonObject::mergeIn, JsonObject::mergeIn);
  }

  Set<String> extractHeaders(List<JsonObject> dwcRecords) {
    return dwcRecords.stream().map(JsonObject::fieldNames)
      .collect(LinkedHashSet::new, Set<String>::addAll, Set<String>::addAll);
  }

  void doWithDwcaRecords(String datasetRef, Handler<AsyncResult<List<JsonObject>>> handler) {
    mongoClient.find("dwcarecords",
      new JsonObject().put("dataset_ref", datasetRef),
      handler);
  }
}
