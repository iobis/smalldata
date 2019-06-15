package org.obis.smalldata.user;

import com.google.common.collect.ImmutableMap;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.util.Map;
import java.util.function.BiConsumer;

import static org.pmw.tinylog.Logger.info;

class UserHandler {

  private final DbUserOperation dbOperation;
  private final Map<String, BiConsumer<Message<JsonObject>, JsonObject>> actionMap;

  UserHandler(MongoClient mongoClient) {
    this.dbOperation = new DbUserOperation(mongoClient);
    actionMap = ImmutableMap.of(
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
  }

  void handleAction(Message<JsonObject> message) {
    var body = message.body();
    var action = body.getString("action");
    if (actionMap.containsKey(action)) {
      actionMap.get(action).accept(message, body);
    } else {
      message.fail(
        ReplyFailure.RECIPIENT_FAILURE.toInt(),
        "Action " + action + " not found on address " + message.address());
    }
  }
}
