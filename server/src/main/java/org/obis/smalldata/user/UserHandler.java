package org.obis.smalldata.user;

import com.google.common.collect.ImmutableMap;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.VertxActionHandler;

import java.util.function.BiConsumer;

import static org.pmw.tinylog.Logger.info;

class UserHandler {

  private final DbUserOperation dbOperation;
  private final VertxActionHandler actionHandler;

  UserHandler(MongoClient mongoClient) {
    this.dbOperation = new DbUserOperation(mongoClient);
    var actionMap = ImmutableMap.<String, BiConsumer<Message<JsonObject>, JsonObject>>of(
      "find", (message, body) -> dbOperation
        .findUsers(body.getJsonObject("query", new JsonObject()))
        .setHandler(ar -> message.reply(new JsonArray(ar.result()))),
      "insert", (message, body) -> dbOperation
        .insertUser(body.getJsonObject("user"))
        .setHandler(ar -> message.reply(ar.result())),
      "replace", (message, body) -> dbOperation
        .updateUser(body.getString("userRef"), body.getJsonObject("user"))
        .setHandler(ar -> {
          info(ar.result());
          message.reply(ar.result());
        })
    );
    this.actionHandler = new VertxActionHandler(actionMap);
  }

  void handleAction(Message<JsonObject> message) {
    actionHandler.handleAction(message);
  }
}
