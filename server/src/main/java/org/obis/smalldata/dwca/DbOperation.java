package org.obis.smalldata.dwca;

import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.BulkOperation;
import io.vertx.ext.mongo.FindOptions;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.UniqueIdGenerator;

import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;

class DbOperation {

  private static final String KEY_REF = "_ref";
  private static final JsonObject DEFAULT_DWCA_FIELDS = new JsonObject()
    .put("dwcRecord.dateAdded", true)
    .put("dwcRecord.id", true)
    .put("user_ref", true)
    .put("dwcTable", true)
    .put("dataset_ref", true);

  private final MongoClient mongoClient;
  private final UniqueIdGenerator idGenerator;

  DbOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
    this.idGenerator = new UniqueIdGenerator(mongoClient);
  }

  Future<List<JsonObject>> findDwcaRecords(JsonObject query) {
    return findDwcaRecords(query, new JsonObject());
  }

  Future<List<JsonObject>> findDwcaRecords(JsonObject query, JsonObject fieldList) {
    var dwcaRecords = Future.<List<JsonObject>>future();
    var fieldProjection = fieldList.size() == 0 ? fieldList : fieldList.mergeIn(DEFAULT_DWCA_FIELDS);
    var options = new FindOptions().setFields(fieldProjection);
    mongoClient.findWithOptions(
      Collections.DATASETRECORDS.dbName(),
      query,
      options,
      res -> dwcaRecords.complete(res.result()));
    return dwcaRecords;
  }

  Future<String> findDatasetCoreTable(String datasetRef) {
    var coreTable = Future.<String>future();
    mongoClient.findWithOptions(
      Collections.DATASETS.dbName(),
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
      Collections.DATASETS.dbName(),
      new JsonObject().put(KEY_REF, datasetRef),
      new JsonObject(),
      res -> dataset.complete(res.result()));
    return dataset;
  }

  Future<JsonObject> insertRecords(String dwcaId, List<JsonObject> records) {
    info("Inserting dwca {}", dwcaId);
    var result = Future.<JsonObject>future();
    mongoClient.runCommand(
      "insert",
      new JsonObject()
        .put("insert", Collections.DATASETRECORDS.dbName())
        .put("documents", new JsonArray(records)),
      ar -> result.complete(ar.result()));
    return result;
  }

  Future<JsonObject> putDwcaRecord(String dwcaId, List<JsonObject> records) {
    info("Replace dwca {}", dwcaId);
    var result = Future.<JsonObject>future();

    mongoClient.findWithOptions(
      Collections.DATASETRECORDS.dbName(),
      new JsonObject().put("dwcRecord.id", dwcaId),
      new FindOptions().setFields(new JsonObject().put("_id", true)),
      arFind -> {
        var oldIds = arFind.result().stream()
          .map(id -> id.getString("_id"))
          .collect(Collectors.toList());
        var operations = oldIds.stream()
          .map(id -> BulkOperation.createDelete(new JsonObject().put("_id", id)))
          .collect(Collectors.toList());
        operations.addAll(records.stream()
          .map(BulkOperation::createInsert)
          .collect(Collectors.toList()));
        mongoClient.bulkWrite(
          Collections.DATASETRECORDS.dbName(),
          operations,
          ar -> result.complete(ar.result().toJson()));
      });
    return result;
  }

  Future<Map<String, String>> coreTableMap() {
    var coreTableMap = Future.<Map<String, String>>future();
    mongoClient.findWithOptions(
      Collections.DATASETS.dbName(),
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
