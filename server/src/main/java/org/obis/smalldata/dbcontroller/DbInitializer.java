package org.obis.smalldata.dbcontroller;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.IndexOptions;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.BulkOperationUtil;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.util.file.IoFile;

import java.util.List;
import java.util.Map;

import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

public class DbInitializer {

  private final MongoClient client;

  DbInitializer(MongoClient client) {
    this.client = client;
  }

  public void newUser(String userId) {
    client.find(
      Collections.USERS.dbName(),
      new JsonObject().put("userId", userId),
      arUserId -> info("userId: {}", arUserId.result()));
    client.insert(
      Collections.USERS.dbName(),
      new JsonObject()
        .put("userId", userId)
        .put("username", "admin")
        .put("password", "admin")
        .put("roles", new JsonArray().add("node admin")),
      arObjectId -> {
        var objectId = arObjectId.result();
        info("added object {}", objectId);
        client.find(
          "users",
          new JsonObject().put("userId", userId),
          arRecord -> info(arRecord.result()));
      });
  }

  private void addIndices() {
    List.of(
      List.of(Collections.DATASETRECORDS.dbName(), "dwcRecord.id"),
      List.of(Collections.DATASETRECORDS.dbName(), "dataset_ref"),
      List.of(Collections.USERS.dbName(), "dataset_refs"),
      List.of(Collections.USERS.dbName(), "emailAddress", "unique"),
      List.of(Collections.DATASETS.dbName(), "_ref", "unique"))
      .forEach(entry -> {
        var options = new IndexOptions().background(true);
        if (entry.contains("unique")) {
          options.unique(true);
        }
        client.createIndexWithOptions(
          entry.get(0),
          new JsonObject()
            .put(entry.get(1), 1)
            .put("collation", DbUtils.INSTANCE.collation),
          options,
          x -> info("created index '{}.{}'", entry.get(0), entry.get(1)));
      });
  }

  private void addMockData() {
    Map.of(
      "users", "demodata/users.json",
      "datasets", "demodata/datasets.json",
      "dwcarecords", "demodata/dwcarecords.json")
      .entrySet().stream()
      .map(entry -> Map.entry(entry.getKey(), IoFile.loadFromResources(entry.getValue())))
      .map(entry -> Map.entry(entry.getKey(), BulkOperationUtil.createInsertsFromJson(entry.getValue())))
      .forEach(entry -> client.bulkWrite(
        entry.getKey(),
        entry.getValue(),
        arClient -> warn("write result: {} from file {}", arClient.result().toJson(), entry.getKey())));
  }

  void mockData() {
    warn("Adding mock data!");
    client.getCollections(arCollections -> {
      if (arCollections.result() != null) {
        arCollections
          .result()
          .forEach(coll -> client.dropCollection(coll, ar -> info("Dropped collection {}", coll)));
      }
    });
    addMockData();
  }

  void setupCollections() {
    client.getCollections(arCollections -> {
      var collections = arCollections.result();
      if (collections.isEmpty()) {
        info("No data found, creating indices");
        addIndices();
      } else if (collections.contains("users") && collections.contains("datasets")) {
        info("Found collections {} - OK", collections);
      } else {
        warn("Found not all collections {} - No clue what to do now", collections);
      }
    });
  }
}
