package org.obis.smalldata.webapi;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;

import java.util.Map;
import java.util.function.Consumer;

import static java.util.Map.entry;

class RouterConfig {
  private final Map<String, Handler<RoutingContext>> handlers = Map.ofEntries(
    entry("getStatus", StatusHandler::status)
  );
  private final Consumer<Router> completionHandler;

  RouterConfig(Consumer<Router> completionHandler) {
    this.completionHandler = completionHandler;
  }

  void invoke(final OpenAPI3RouterFactory routerFactory) {
    handlers.forEach(routerFactory::addHandlerByOperationId);

    Router router = routerFactory.getRouter();
    router.get("/*").handler(StaticHandler.create());
    completionHandler.accept(router);
  }
}
