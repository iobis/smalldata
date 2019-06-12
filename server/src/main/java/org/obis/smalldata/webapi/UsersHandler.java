package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class UsersHandler {

  private static final String ADDRESS_USERS = "users";

  static void getUsers(RoutingContext context) {
    context.vertx().eventBus().<JsonArray>send(
      ADDRESS_USERS,
      new JsonObject().put("action", "find"),
      ar -> context.response().end(ar.result().body().encode()));
  }

}
