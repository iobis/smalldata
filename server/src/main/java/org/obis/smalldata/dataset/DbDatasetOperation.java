package org.obis.smalldata.dataset;

import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.smalldata.util.UniqueIdGenerator;
import org.pmw.tinylog.Logger;

import java.util.List;

class DbDatasetOperation {

  private static final String KEY_REF = "_ref";
  private static final String QUERY_REF = "ref";

  private final MongoClient mongoClient;
  private final UniqueIdGenerator idGenerator;

  DbDatasetOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    idGenerator = new UniqueIdGenerator(mongoClient);
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

  public Future<JsonObject> insertDataset(JsonObject dataset) {
    var resultDataset = Future.<JsonObject>future();
    DbUtils.INSTANCE.insertDocument(mongoClient,
      idGenerator,
      Collections.DATASETS,
      dataset,
      resultDataset);
    return resultDataset;
  }

  public Future<JsonObject> updateDataset(String datasetRef, JsonObject dataset) {
    var resultDataset = Future.<JsonObject>future();
    Logger.info(dataset.put(QUERY_REF, datasetRef));
    mongoClient.replaceDocuments(
      Collections.DATASETS.dbName(),
      new JsonObject().put(KEY_REF, datasetRef),
      dataset.put(KEY_REF, datasetRef),
      ar -> resultDataset.complete(dataset.put(QUERY_REF, dataset.remove(KEY_REF))));
    return resultDataset;
  }
}
