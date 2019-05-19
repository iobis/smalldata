package org.obis.smalldata.dwca;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.UniqueIdGenerator;

import java.util.List;
import java.util.function.Consumer;

class DbOperation {

  private final MongoClient mongoClient;
  private final UniqueIdGenerator idGenerator;

  DbOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    this.idGenerator = new UniqueIdGenerator(mongoClient);
  }

  Future<List<JsonObject>> findDwcaRecords(String datasetRef) {
    var dwcaRecords = Future.<List<JsonObject>>future();
    mongoClient.find(
      "dwcarecords",
      new JsonObject().put("dataset_ref", datasetRef),
      res -> dwcaRecords.complete(res.result()));
    return dwcaRecords;
  }

  Future<JsonObject> findDataset(String datasetRef) {
    var dataset = Future.<JsonObject>future();
    mongoClient.findOne(
      "datasets",
      new JsonObject().put("_ref", datasetRef),
      new JsonObject(),
      res -> dataset.complete(res.result()));
    return dataset;
  }

  Future<JsonObject> insertRecords(List<JsonObject> records) {
    var result = Future.<JsonObject>future();
    var dwcInserts = new JsonArray();
    records.stream()
      .forEach(dwcInserts::add);
    mongoClient.runCommand("insert",
      new JsonObject().put("insert", "dwcarecords")
        .put("documents", new JsonArray(records)),
      ar -> result.complete(ar.result()));
    return result;
  }

  void withNewId(String collection, Consumer<String> idConsumer) {
    idGenerator.consumeNewId(collection, "id", idConsumer);
  }
}
