package org.obis.smalldata.webapi;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class UsersHandler {

  private static final String ADDRESS_USERS = "users";

  static void getUsers(RoutingContext context) {
    JsonObject query = new JsonObject();
    context.queryParams().forEach(entry -> query.put(entry.getKey(), entry.getValue()));
    context.vertx().eventBus().<JsonArray>send(
      ADDRESS_USERS,
      new JsonObject()
        .put("action", "find")
        .put("query", query),
      ar -> context.response().end(ar.result().body().encode()));
  }

  private UsersHandler() {}

}
