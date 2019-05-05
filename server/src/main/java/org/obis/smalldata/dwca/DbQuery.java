package org.obis.smalldata.dwca;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.List;

class DbQuery {

  private final MongoClient mongoClient;

  DbQuery(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  Future<List<JsonObject>> dwcaRecords(String datasetRef) {
    var dwcaRecords = Future.<List<JsonObject>>future();
    mongoClient.find(
      "dwcarecords",
      new JsonObject().put("dataset_ref", datasetRef),
      res -> dwcaRecords.complete(res.result()));
    return dwcaRecords;
  }

  Future<JsonObject> dataset(String datasetRef) {
    var dataset = Future.<JsonObject>future();
    mongoClient.findOne(
      "datasets",
      new JsonObject().put("_ref", datasetRef),
      new JsonObject(),
      res -> dataset.complete(res.result()));
    return dataset;
  }
}
