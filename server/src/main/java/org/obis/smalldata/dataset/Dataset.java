package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

public class Dataset extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    var mongoClient = MongoClient.createShared(vertx, dbConfig);
    vertx.eventBus().localConsumer("dataset", this::handleDatasetEvents);
    startFuture.complete();
  }

  private <JsonObject> void handleDatasetEvents(Message<JsonObject> message) {
  }

}
