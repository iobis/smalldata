package org.obis.smalldata.webapi;

import static org.pmw.tinylog.Logger.info;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class FailureHandler {
  public static void fallback(RoutingContext context) {
    if (context.failure() == null) {
      info("Fallback with response {}", context.response().getStatusCode());
      if (context.statusCode() > 0) {
        var error =
            new JsonObject()
                .put("exception", "not specified")
                .put("statusCode", context.statusCode());
        context
            .response()
            .setStatusCode(context.statusCode())
            .putHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8")
            .end(error.encode());
      } else {
        var error = new JsonObject().put("exception", "not specified").put("statusCode", 500);
        context
            .response()
            .setStatusCode(500)
            .putHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8")
            .end(error.encode());
      }
    } else {
      info(context.failure(), "Fallback to failure with response {}", context.response());
      var error =
          new JsonObject()
              .put("timestamp", System.nanoTime())
              .put("exception", context.failure().getClass().getName())
              .put("exceptionMessage", context.failure().getMessage())
              .put("path", context.request().path());
      context
          .response()
          .putHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=utf-8")
          .end(error.encode());
    }
  }

  private FailureHandler() {}
}
