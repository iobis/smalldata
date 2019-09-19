package org.obis.smalldata.util;

import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.ReplyFailure;
import io.vertx.core.json.JsonObject;
import java.util.Map;
import java.util.function.BiConsumer;

public class VertxActionHandler {

  private final Map<String, BiConsumer<Message<JsonObject>, JsonObject>> actionMap;

  public VertxActionHandler(Map<String, BiConsumer<Message<JsonObject>, JsonObject>> actionMap) {
    this.actionMap = actionMap;
  }

  public void handleAction(Message<JsonObject> message) {
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
