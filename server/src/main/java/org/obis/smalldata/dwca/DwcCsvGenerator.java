package org.obis.smalldata.dwca;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.pmw.tinylog.Logger;

import java.security.cert.CollectionCertStoreParameters;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.info;

class DwcCsvGenerator {

  private final MongoClient mongoClient;

  DwcCsvGenerator(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  // TODO: per table! -> return type Map<String, List<JsonObject>>
  List<JsonObject> extractDwcRecords(List<JsonObject> dataset) {
    var dwcRecords = new ArrayList<JsonObject>();
    dataset.stream()
      .map(record -> record.getJsonObject("dwcRecord"))
      .forEach(record -> {
        var id = record.getString("id");
        record.stream()
          .filter(ns -> !"id".equals(ns.getKey()))
          .filter(ns -> !((JsonObject) ns.getValue()).isEmpty())
          .map(entry -> {
            var ns = entry.getKey();
            return ((JsonObject) entry.getValue()).stream()
              .map(header -> new JsonObject().put(ns + "/" + header.getKey(), header.getValue()))
              .collect(JsonObject::new, JsonObject::mergeIn, JsonObject::mergeIn);
          })
          .map(entry -> new JsonObject().put("id", id).mergeIn(entry))
          .forEach(dwcRecords::add);
      });
    debug("Added dwc records: {} ", dwcRecords);
    return dwcRecords;
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
