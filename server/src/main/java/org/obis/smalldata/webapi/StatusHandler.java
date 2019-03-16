package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StatusHandler {

  static void status(RoutingContext context) {
    context.response()
      .putHeader("content-type", "application/json")
      .end(new JsonObject().put("title", "Small Data Status").encode());
  }
}
