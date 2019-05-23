package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class StatusHandler {

  public static void status(RoutingContext context) {
    context.response()
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("title", "Small Data Status").encode());
  }

  private StatusHandler() {
  }
}
