package org.obis.smalldata.dwca;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.FindOptions;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.UniqueIdGenerator;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

class DbOperation {

  private static final String KEY_REF = "_ref";

  private final MongoClient mongoClient;
  private final UniqueIdGenerator idGenerator;

  DbOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    this.idGenerator = new UniqueIdGenerator(mongoClient);
  }

  Future<List<JsonObject>> queryDwcaRecords(JsonObject query) {
    var dwcaRecords = Future.<List<JsonObject>>future();
    mongoClient.find(
      "dwcarecords",
      query,
      res -> dwcaRecords.complete(res.result()));
    return dwcaRecords;
  }

  Future<String> findDatasetCoreTable(String datasetRef) {
    var coreTable = Future.<String>future();
    mongoClient.findWithOptions(
      "datasets",
      new JsonObject().put(KEY_REF, datasetRef),
      new FindOptions().setFields(new JsonObject().put("meta.dwcTables.core", true)),
      res -> {
        if (res.succeeded() && res.result().size() == 1) {
          coreTable.complete(extractCoreTable(res.result().get(0)));
        } else {
          coreTable.fail("Cannot find dataset");
        }
      });
    return coreTable;
  }

  Future<JsonObject> findDataset(String datasetRef) {
    var dataset = Future.<JsonObject>future();
    mongoClient.findOne(
      "datasets",
      new JsonObject().put(KEY_REF, datasetRef),
      new JsonObject(),
      res -> dataset.complete(res.result()));
    return dataset;
  }

  Future<JsonObject> insertRecords(List<JsonObject> records) {
    var result = Future.<JsonObject>future();
    var dwcInserts = new JsonArray();
    records.forEach(dwcInserts::add);
    mongoClient.runCommand(
      "insert",
      new JsonObject()
        .put("insert", "dwcarecords")
        .put("documents", new JsonArray(records)),
      ar -> result.complete(ar.result()));
    return result;
  }

  Future<Map<String, String>> coreTableMap() {
    var coreTableMap = Future.<Map<String, String>>future();
    mongoClient.findWithOptions(
      "datasets",
      new JsonObject(),
      new FindOptions().setFields(new JsonObject().put("meta.dwcTables.core", true)
        .put(KEY_REF, true)),
      ar -> coreTableMap.complete(ar.result().stream()
        .map(dataset -> new AbstractMap.SimpleEntry<>(
          dataset.getString(KEY_REF),
          extractCoreTable(dataset)))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))));
    return coreTableMap;
  }

  void withNewId(String collection, Consumer<String> idConsumer) {
    idGenerator.consumeNewId(collection, "id", idConsumer);
  }

  private String extractCoreTable(JsonObject dataset) {
    return dataset.getJsonObject("meta").getJsonObject("dwcTables").getString("core");
  }
}
