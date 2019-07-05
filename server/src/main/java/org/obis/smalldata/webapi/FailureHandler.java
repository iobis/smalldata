package org.obis.smalldata.webapi;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class FailureHandler {

  public static void fallback(RoutingContext context) {
    if (null == context.failure()) {
      if (context.statusCode() > 0) {
        context.response().setStatusCode(context.statusCode()).end();
      } else {
        context.response().setStatusCode(500).end();
      }
    } else {
      var error = new JsonObject()
        .put("timestamp", System.nanoTime())
        .put("exception", context.failure().getClass().getName())
        .put("exceptionMessage", context.failure().getMessage())
        .put("path", context.request().path());
      context.response().putHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8");
      context.response().end(error.encode());
    }
  }

  private FailureHandler() {
  }
}
