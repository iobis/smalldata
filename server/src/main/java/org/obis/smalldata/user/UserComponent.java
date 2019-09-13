package org.obis.smalldata.user;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.Collections;
import org.obis.smalldata.util.DbUtils;

public class UserComponent extends AbstractVerticle {

  private MongoClient mongoClient;

  @Override
  public void start(Future<Void> startFuture) {
    var dbConfig = (JsonObject) vertx.sharedData().getLocalMap("settings").get("storage");
    mongoClient = MongoClient.createShared(vertx, dbConfig);
    var bulkinessConfig =
        config().getJsonObject("bulkiness", new JsonObject().put("halfTimeInDays", 1.0));
    var bulkinessCalculator = new BulkinessCalculator(bulkinessConfig.getDouble("halfTimeInDays"));
    var dbUserOperation = new DbUserOperation(bulkinessCalculator, mongoClient);

    var bulkinessHandler = new BulkinessHandler(dbUserOperation);
    var userHandler = new UserHandler(dbUserOperation);
    vertx.eventBus().localConsumer("users", userHandler::handleAction);
    vertx.eventBus().localConsumer("users.bulkiness", bulkinessHandler::handleBulkiness);
    vertx.eventBus().localConsumer("users.exists", this::handleExists);

    startFuture.complete();
  }

  private void handleExists(Message<String> message) {
    var userRef = message.body();
    DbUtils.INSTANCE.findOne(
        mongoClient, Collections.USERS, new JsonObject().put("_ref", userRef), message);
  }
}
