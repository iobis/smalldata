package org.obis.smalldata.webapi;

import io.vertx.core.Handler;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;

import java.util.Map;
import java.util.function.Consumer;

class RouterConfig {

  private static final Map<String, OperationHandlers> HANDLERS = Map.of(
    "getDatasets", new OperationHandlers(DatasetsHandler::fetch),
    "getOneDataset", new OperationHandlers(DatasetsHandler::fetch),
    "getDwcaRecords", new OperationHandlers(DwcaHandler::getRecords),
    "getDwcaRecord", new OperationHandlers(DwcaHandler::getRecord),
    "login", new OperationHandlers(LoginHandler::login),
    "getStatus", new OperationHandlers(StatusHandler::status),
    "getRss", new OperationHandlers(RssHandler::fetch),
    "getDWCA", new OperationHandlers(DwcaHandler::getZip),
    "postDWCA", new OperationHandlers(OccurrenceHandler::post)
  );

  private final Consumer<Router> completionHandler;

  RouterConfig(Consumer<Router> completionHandler) {
    this.completionHandler = completionHandler;
  }

  void invoke(OpenAPI3RouterFactory routerFactory) {
    HANDLERS.forEach((operationId, handler) -> {
      routerFactory.addHandlerByOperationId(operationId, handler.handler);
      routerFactory.addFailureHandlerByOperationId(operationId, handler.failureHandler);
    });
    var router = routerFactory.getRouter();
    router.get("/openapi/*").handler(StaticHandler.create("swaggerroot"));
    router.get("/login/*").handler(StaticHandler.create("loginroot"));
    router.get("/*").handler(StaticHandler.create());

    completionHandler.accept(router);
  }

  private static class OperationHandlers {

    private final Handler<RoutingContext> handler;
    private final Handler<RoutingContext> failureHandler = FailureHandler::fallback;

    OperationHandlers(Handler<RoutingContext> handler) {
      this.handler = handler;
    }
  }
}
