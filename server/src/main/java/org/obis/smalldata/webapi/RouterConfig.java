package org.obis.smalldata.webapi;

import io.vertx.core.Handler;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;

import java.util.Map;
import java.util.function.Consumer;

class RouterConfig {

  private static final Map<String, OperationHandlers> HANDLERS = Map.ofEntries(
    Map.entry("getDatasets", new OperationHandlers(DatasetsHandler::fetch)),
    Map.entry("getOneDataset", new OperationHandlers(DatasetsHandler::fetch)),
    Map.entry("postDataset", new OperationHandlers(DatasetsHandler::post)),
    Map.entry("putDataset", new OperationHandlers(DatasetsHandler::put)),
    Map.entry("getUserRecords", new OperationHandlers(DwcaRecordsHandler::getForUser)),
    Map.entry("getUsers", new OperationHandlers(UsersHandler::getUsers)),
    Map.entry("postUser", new OperationHandlers(UsersHandler::postUser)),
    Map.entry("putUser", new OperationHandlers(UsersHandler::putUser)),
    Map.entry("login", new OperationHandlers(LoginHandler::login)),
    Map.entry("getStatus", new OperationHandlers(StatusHandler::status)),
    Map.entry("getRss", new OperationHandlers(RssHandler::fetch)),
    Map.entry("getDWCA", new OperationHandlers(DwcaHandler::get)),
    Map.entry("getDWCARecord", new OperationHandlers(DwcaRecordsHandler::get)),
    Map.entry("postDWCARecord", new OperationHandlers(DwcaRecordsHandler::post)),
    Map.entry("putDWCARecord", new OperationHandlers(DwcaRecordsHandler::put))
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
