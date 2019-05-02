package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

public class DatasetComponent extends AbstractVerticle {

  private MongoClient mongoClient;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    mongoClient = MongoClient.createShared(vertx, dbConfig);
    vertx.eventBus().localConsumer("dataset", this::handleDatasetEvents);
    startFuture.complete();
  }

  private void handleDatasetEvents(Message<JsonObject> message) {
    mongoClient.find("datasets",
      new JsonObject(),
      resultHandler -> message.reply(new JsonArray(resultHandler.result())));
  }
}
