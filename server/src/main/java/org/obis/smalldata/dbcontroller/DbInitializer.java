package org.obis.smalldata.dbcontroller;

import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.FindOptions;
import io.vertx.ext.mongo.IndexOptions;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.mongo.UpdateOptions;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.obis.smalldata.util.BulkOperationUtil;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;
import org.obis.smalldata.util.UniqueIdGenerator;
import org.obis.util.file.IoFile;

public class DbInitializer {

  private static final String KEY_BULKINESS = "bulkiness";
  private final MongoClient client;

  DbInitializer(MongoClient client) {
    this.client = client;
  }

  Future<Boolean> setupCollections() {
    var setup = Future.<Boolean>future();
    client.getCollections(
        arCollections -> {
          var collections = arCollections.result();
          if (collections.isEmpty()) {
            info("No data found, creating indices");
            addIndices();
          } else if (collections.contains("users") && collections.contains("datasets")) {
            info("Found collections {} - OK", collections);
          } else {
            warn("Found not all collections {} - No clue what to do now", collections);
          }
          setup.complete(arCollections.succeeded());
        });
    return setup;
  }

  Future<Void> updateAdmin(String mainAdmin) {
    var done = Future.<Void>future();
    if (null == mainAdmin) {
      done.fail("No main admin set!");
    } else {
      new UniqueIdGenerator(client)
          .consumeNewId(
              Collections.USERS.dbName(),
              "_ref",
              newRef -> {
                client.findOneAndUpdateWithOptions(
                    Collections.USERS.dbName(),
                    new JsonObject().put("emailAddress", mainAdmin),
                    new JsonObject()
                        .put("$set", new JsonObject().put("role", "node admin"))
                        .put(
                            "$setOnInsert",
                            new JsonObject().put("emailAddress", mainAdmin).put("_ref", newRef)),
                    new FindOptions(),
                    new UpdateOptions().setUpsert(true),
                    ar -> {
                      info("Added admin: {}", ar);
                      done.complete();
                    });
              });
    }
    return done;
  }

  Future<Boolean> mockData() {
    warn("Adding mock data!");
    var mock = Future.<Boolean>future();
    client.getCollections(
        arCollections -> {
          if (arCollections.result() != null) {
            arCollections
                .result()
                .forEach(
                    coll -> client.dropCollection(coll, ar -> info("Dropped collection {}", coll)));
          }
          addMockData(mock);
        });
    return mock;
  }

  Future<Boolean> initBulkiness() {
    info("Setting bulkiness to 0 if not defined");
    var initialized = Future.<Boolean>future();
    client.updateCollectionWithOptions(
        Collections.USERS.dbName(),
        new JsonObject()
            .put(
                "$or",
                new JsonArray()
                    .add(
                        new JsonObject().put(KEY_BULKINESS, new JsonObject().put("$exists", false)))
                    .add(new JsonObject().put(KEY_BULKINESS, false))),
        new JsonObject()
            .put(
                "$set",
                new JsonObject()
                    .put(
                        KEY_BULKINESS,
                        new JsonObject().put("instant", Instant.now()).put("value", 0.0))),
        new UpdateOptions().setUpsert(false).setMulti(true),
        ar -> {
          info("Initialized user bulkiness!");
          initialized.complete(ar.succeeded());
        });
    return initialized;
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
            .put("roles", new JsonArray().add("node manager")),
        arObjectId -> {
          var objectId = arObjectId.result();
          info("added object {}", objectId);
          client.find(
              "users", new JsonObject().put("userId", userId), arRecord -> info(arRecord.result()));
        });
  }

  private void addIndices() {
    List.of(
            List.of(Collections.DATASETRECORDS.dbName(), "dwcRecord.id"),
            List.of(Collections.DATASETRECORDS.dbName(), "dataset_ref"),
            List.of(Collections.USERS.dbName(), "dataset_refs"),
            List.of(Collections.USERS.dbName(), "emailAddress", "unique"),
            List.of(Collections.DATASETS.dbName(), "_ref", "unique"))
        .forEach(
            entry -> {
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

  private void addMockData(Future<Boolean> mockDataAdded) {
    var collections =
        Map.of(
            Collections.USERS.dbName(), "demodata/users.json",
            Collections.DATASETS.dbName(), "demodata/datasets.json",
            Collections.DATASETRECORDS.dbName(), "demodata/dwcarecords.json");
    var futures =
        collections
            .keySet()
            .stream()
            .collect(Collectors.toMap(Function.identity(), dbName -> Future.<Boolean>future()));
    collections
        .entrySet()
        .stream()
        .map(entry -> Map.entry(entry.getKey(), IoFile.loadFromResources(entry.getValue())))
        .map(
            entry ->
                Map.entry(
                    entry.getKey(), BulkOperationUtil.createInsertsFromJson(entry.getValue())))
        .forEach(
            entry ->
                client.bulkWrite(
                    entry.getKey(),
                    entry.getValue(),
                    arClient -> {
                      warn(
                          "write result: {} from file {}",
                          arClient.result().toJson(),
                          entry.getKey());
                      futures.get(entry.getKey()).complete();
                    }));
    CompositeFuture.all(new ArrayList<>(futures.values()))
        .setHandler(ar -> mockDataAdded.complete(ar.succeeded()));
  }
}
