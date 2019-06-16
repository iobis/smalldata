package org.obis.smalldata.user;

import com.google.common.collect.ImmutableMap;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.util.VertxActionHandler;

import java.util.function.BiConsumer;

class BulkinessHandler {

  private final VertxActionHandler actionHandler;

  BulkinessHandler(DbUserOperation dbOperation) {
    var actionMap = ImmutableMap.<String, BiConsumer<Message<JsonObject>, JsonObject>>of(
      "increase", (message, body) -> {
        dbOperation.increaseBulkiness(body.getString("userRef"))
          .setHandler(ar -> message.reply(ar.result()));
      });
    this.actionHandler = new VertxActionHandler(actionMap);
  }

  void handleBulkiness(Message<JsonObject> message) {
    actionHandler.handleAction(message);
  }
}
