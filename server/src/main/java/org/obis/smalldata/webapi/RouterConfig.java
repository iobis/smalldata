package org.obis.smalldata.webapi;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;

import java.util.function.Consumer;

class RouterConfig {
  private final Consumer<Router> completionHandler;

  RouterConfig(Consumer<Router> completionHandler) {
    this.completionHandler = completionHandler;
  }

  void invoke(final OpenAPI3RouterFactory routerFactory) {
    routerFactory.addHandlerByOperationId("getStatus",
      context -> context.response()
        .putHeader("content-type", "application/json")
        .end(new JsonObject().put("title", "Small Data Status").encode()));
    Router router = routerFactory.getRouter();
    router.get("/*").handler(StaticHandler.create());
    completionHandler.accept(router);
  }
}
