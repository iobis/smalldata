package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class FailureHandler {

  static void fallback(RoutingContext context) {
    var error = new JsonObject()
      .put("timestamp", System.nanoTime())
      .put("exception", context.failure().getClass().getName())
      .put("exceptionMessage", context.failure().getMessage())
      .put("path", context.request().path());
    context.response().putHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8");
    context.response().end(error.encode());
  }
}
