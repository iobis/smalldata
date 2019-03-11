package org.obis.smalldata.db;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vertx.core.Handler;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.BulkOperation;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.IoFile;
import org.pmw.tinylog.Logger;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

public class DbInitializer {

  private final UniqueIdGenerator uniqueIdGenerator;
  private final MongoClient client;

  DbInitializer(MongoClient client) {
    this.client = client;
    this.uniqueIdGenerator = new UniqueIdGenerator(client);
  }

  public void newUser(String userId) {
    client.find(Collections.USERS.dbName(), new JsonObject().put("userid", userId),
      arUserId -> info("userID: {}", arUserId.result()));
    client.insert(Collections.USERS.dbName(), new JsonObject()
        .put("userid", userId)
        .put("username", "admin")
        .put("password", "admin")
        .put("roles", new JsonArray().add("node admin")),
      arObjectId -> {
        var objectId = arObjectId.result();
        info("added object {}", objectId);
        client.find("users", new JsonObject().put("userid", userId),
          arRecord -> info(arRecord.result()));
      });
  }

  private void addIndices() {
    //uniqueIdGenerator.consumeNewId(Collections.USERS.dbName(), "_ref", this::newUser);
    List.of(new String[]{Collections.DWCADOCS.dbName(), "_ref"},
      new String[]{Collections.DWCADOCS.dbName(), "dataset_ref"},
      new String[]{Collections.DATASETS.dbName(), "_ref"})
      .forEach(entry ->
        client.createIndex(entry[0], new JsonObject().put(entry[1], 1)
          .put("collation", Const.INSTANCE.collation)
          .put("background", true), x -> info("created index '{}.{}'", entry[0], entry[1])));
  }

  private void addMockData() {
    var operations = BulkOperationUtil.createOperationsFromJson(IoFile.loadFromResources("mockdata/users.json"));
    client.bulkWrite("users", operations,
      arClient -> warn("write result: {}",arClient.result().toJson()));
  }

  void mockData() {
    warn("Adding mock data!");
    client.getCollections(arColls -> {
      if (arColls.result() != null)
        arColls.result().forEach(coll -> client.dropCollection(coll, ar ->
          info("Dropped collection {}", coll)));
    });
    addMockData();
  }

  void setupCollections() {
    client.getCollections(arColls -> {
      var colls = arColls.result();
      if (colls.isEmpty()) {
        info("No data found, creating indices");
        addIndices();
      } else if (colls.contains("users") && colls.contains("datasets")) {
        info("Found collections {} - OK", colls);
      } else {
        Logger.warn("Found not all collections {} - No clue what to do now", colls);
      }
    });
  }
}
