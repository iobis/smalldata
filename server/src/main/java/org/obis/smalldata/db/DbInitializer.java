package org.obis.smalldata.db;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.pmw.tinylog.Logger;

import java.util.List;

public class DbInitializer {

  private UniqueIdGenerator uniqueIdGenerator;
  private MongoClient client;

  DbInitializer(MongoClient client) {
    this.client = client;
    this.uniqueIdGenerator = new UniqueIdGenerator(client);
  }

  public void newUser(String userId) {
    client.find(Collections.USERS.dbName(), new JsonObject().put("userid", userId),
      arUserId -> Logger.info("userID: {}", arUserId.result()));
    client.insert(Collections.USERS.dbName(), new JsonObject()
        .put("userid", userId)
        .put("username", "admin")
        .put("password", "admin")
        .put("roles", new JsonArray().add("node admin")),
      arObjectId -> {
        var objectId = arObjectId.result();
        Logger.info("added object {}", objectId);
        client.find("users", new JsonObject().put("userid", userId),
          arRecord -> Logger.info(arRecord.result()));
      });
  }

  private void addCollections() {
    uniqueIdGenerator.consumeNewId(Collections.USERS.dbName(), "userid", this::newUser);
    List.of(new String[]{Collections.DWCADOCS.dbName(), "dwcaid"},
      new String[]{Collections.DWCADOCS.dbName(), "datasetid"},
      new String[]{Collections.DATASETS.dbName(), "datasetid"})
      .forEach(entry ->
        client.createIndex(entry[0], new JsonObject().put(entry[1], 1)
            .put("collation", Const.INSTANCE.collation), x -> Logger.info("created index '{}'", entry[1])));
  }

  void mockData() {
  }

  void createCollections() {
    client.getCollections(arColls -> {
      var colls = arColls.result();
      if (colls.isEmpty()) {
        Logger.info("No data found, creating collections");
        addCollections();
      } else if (colls.contains("users") && colls.contains("datasets")) {
        Logger.info("Found collections {} - OK", colls);
      } else {
        Logger.warn("Found not all collections {} - No clue what to do now", colls);
      }
    });
  }
}
