package org.obis.smalldata.dataset;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;

import java.util.List;

class DbDatasetOperation {

  private final MongoClient mongoClient;

  DbDatasetOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  Future<List<JsonObject>> findDatasets(JsonObject query) {
    var datasets = Future.<List<JsonObject>>future();
    mongoClient.find(
      Collections.DATASETS.dbName(),
      query,
      res -> datasets.complete(res.result()));
    return datasets;
  }

  Future<JsonObject> findOneDataset(JsonObject query) {
    var dataset = Future.<JsonObject>future();
    mongoClient.findOne(
      Collections.DATASETS.dbName(),
      query,
      new JsonObject(),
      res -> dataset.complete(res.result()));
    return dataset;
  }

}
