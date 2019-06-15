package org.obis.smalldata.dataset;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;

public class DatasetComponent extends AbstractVerticle {

  private MongoClient mongoClient;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    mongoClient = MongoClient.createShared(vertx, dbConfig);
    var actionHandler = new DatasetActionHandler(mongoClient);
    vertx.eventBus().localConsumer("datasets", actionHandler::handleAction);
    vertx.eventBus().localConsumer("datasets.exists", this::handleExists);
    startFuture.complete();
  }

  private void handleExists(Message<String> message) {
    var datasetRef = message.body();
    DbUtils.INSTANCE.findOne(mongoClient, Collections.DATASETS, new JsonObject().put("_ref", datasetRef), message);
  }

}
