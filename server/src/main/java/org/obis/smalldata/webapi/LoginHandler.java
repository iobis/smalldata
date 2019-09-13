package org.obis.smalldata.webapi;

import static org.pmw.tinylog.Logger.info;

import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

class LoginHandler {

  static void login(RoutingContext context) {
    info("login headers: {}", context.request().headers());
    context
        .vertx()
        .eventBus()
        .<JsonObject>send(
            "auth.login",
            context.getBodyAsJson(),
            authResponse ->
                context
                    .response()
                    .putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                    .end(authResponse.result().body().encode()));
  }

  private LoginHandler() {}
}
