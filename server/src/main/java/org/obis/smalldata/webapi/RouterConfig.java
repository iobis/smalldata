package org.obis.smalldata.webapi;

import io.vertx.core.Handler;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;
import lombok.Value;

import java.util.Map;
import java.util.function.Consumer;

class RouterConfig {

  private final Consumer<Router> completionHandler;
  private final Map<String, OperationHandlers> handlers = Map.of(
    "getStatus", new OperationHandlers(StatusHandler::status),
    "getRss", new OperationHandlers(RssHandler::fetch)
  );

  RouterConfig(Consumer<Router> completionHandler) {
    this.completionHandler = completionHandler;
  }

  void invoke(OpenAPI3RouterFactory routerFactory) {
    handlers.forEach((operationId, opHandlers) -> {
      routerFactory.addHandlerByOperationId(operationId, opHandlers.getHandler());
      routerFactory.addFailureHandlerByOperationId(operationId, opHandlers.getFailureHandler());
    });

    var router = routerFactory.getRouter();
    router.get("/swagger/*").handler(StaticHandler.create("swaggerroot"));
    router.get("/*").handler(StaticHandler.create());
    completionHandler.accept(router);
  }

  @Value
  class OperationHandlers {

    private Handler<RoutingContext> handler;
    private Handler<RoutingContext> failureHandler;

    OperationHandlers(Handler<RoutingContext> handler) {
      this(handler, FailureHandler::fallback);
    }

    OperationHandlers(Handler<RoutingContext> handler, Handler<RoutingContext> failureHandler) {
      this.handler = handler;
      this.failureHandler = failureHandler;
    }
  }
}
