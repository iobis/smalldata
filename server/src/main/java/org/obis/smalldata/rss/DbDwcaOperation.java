package org.obis.smalldata.rss;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import java.time.Instant;

class DbDwcaOperation {

  private final MongoClient mongoClient;

  DbDwcaOperation(MongoClient mongoClient) {
    this.mongoClient = mongoClient;
  }

  void withAggregatedDatasets(Handler<AsyncResult<JsonObject>> cursorHandler) {
    mongoClient.runCommand(
        "aggregate",
        new JsonObject()
            .put("aggregate", "dwcarecords")
            .put(
                "pipeline",
                new JsonArray()
                    .add(new JsonObject().put("$sort", new JsonObject().put("addedAtInstant", -1)))
                    .add(
                        new JsonObject()
                            .put(
                                "$group",
                                new JsonObject()
                                    .put("_id", "$dataset_ref")
                                    .put("latest", new JsonObject().put("$first", "$$ROOT"))))
                    .add(
                        new JsonObject()
                            .put(
                                "$project",
                                new JsonObject()
                                    .put("dataset_ref", "$latest.dataset_ref")
                                    .put(
                                        "addedAtInstant",
                                        new JsonObject()
                                            .put(
                                                "$ifNull",
                                                new JsonArray()
                                                    .add("$latest.addedAtInstant")
                                                    .add(Instant.EPOCH.toString())))))
                    .add(new JsonObject().put("$sort", new JsonObject().put("type", 1))))
            .put("cursor", new JsonObject()),
        cursorHandler);
  }
}
