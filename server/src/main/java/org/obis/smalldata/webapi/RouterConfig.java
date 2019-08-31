package org.obis.smalldata.webapi;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.RouterFactoryOptions;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.StaticHandler;
import org.obis.smalldata.webapi.authority.Authority;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Predicate;

class RouterConfig {

  private final Map<String, OperationHandlers> operationHandlers;
  private final Authority authority;
  private final Consumer<Router> completionHandler;
  private final Map<String, Handler<RoutingContext>> securityHandlers;

  RouterConfig(
    Consumer<Router> completionHandler,
    Authority authority,
    Map<String, Handler<RoutingContext>> securityHandlers) {
    this.completionHandler = completionHandler;
    this.securityHandlers = securityHandlers;
    this.authority = authority;
    var researcherAccess = authority.authorizeRoles(Arrays.asList("node manager", "researcher"));
    var nodeManagerOnly = authority.authorizeRoles(Arrays.asList("node manager"));
    this.operationHandlers = Map.ofEntries(
      Map.entry("getDatasets",
        new OperationHandlers(protectHandler(DatasetsHandler::fetch, researcherAccess))),
      Map.entry("getOneDataset",
        new OperationHandlers(protectHandler(DatasetsHandler::fetch, researcherAccess))),
      Map.entry("postDataset",
        new OperationHandlers(protectHandler(DatasetsHandler::post, nodeManagerOnly))),
      Map.entry("putDataset",
        new OperationHandlers(protectHandler(DatasetsHandler::put, nodeManagerOnly))),
      Map.entry("getUserRecords",
        new OperationHandlers(protectHandler(DwcaRecordsHandler::getForUser, researcherAccess))),
      Map.entry("getUsers",
        new OperationHandlers(protectHandler(UsersHandler::getUsers, researcherAccess))),
      Map.entry("postUser",
        new OperationHandlers(protectHandler(UsersHandler::postUser, nodeManagerOnly))),
      Map.entry("putUser",
        new OperationHandlers(protectHandler(UsersHandler::putUser, nodeManagerOnly))),
      Map.entry("login",
        new OperationHandlers(LoginHandler::login)),
      Map.entry("getStatus",
        new OperationHandlers(StatusHandler::status)),
      Map.entry("getRss",
        new OperationHandlers(RssHandler::fetch)),
      Map.entry("getDWCA",
        new OperationHandlers(protectHandler(DwcaHandler::get, researcherAccess))),
      Map.entry("getDWCARecord",
        new OperationHandlers(protectHandler(DwcaRecordsHandler::get, researcherAccess))),
      Map.entry("postDWCARecord",
        new OperationHandlers(protectHandler(DwcaRecordsHandler::post, researcherAccess))),
      Map.entry("putDWCARecord",
        new OperationHandlers(protectHandler(DwcaRecordsHandler::put, researcherAccess))));
  }

  void invoke(OpenAPI3RouterFactory routerFactory) {
    routerFactory.setOptions(new RouterFactoryOptions().setRequireSecurityHandlers(true));
    securityHandlers.forEach(routerFactory::addSecurityHandler);
    operationHandlers.forEach((operationId, handler) -> {
      routerFactory.addHandlerByOperationId(operationId, handler::getHandler);
      routerFactory.addFailureHandlerByOperationId(operationId, handler.failureHandler);
    });

    var router = routerFactory.getRouter();
    router.get("/openapi/*").handler(StaticHandler.create("swaggerroot"));
    router.get("/login/*").handler(StaticHandler.create("loginroot"));
    router.get("/*").handler(StaticHandler.create());

    completionHandler.accept(router);
  }

  private Handler<RoutingContext> protectHandler(
    Handler<RoutingContext> handler,
    Predicate<JsonObject> isAuthorized) {
    return context -> {
      context.vertx().eventBus()
        .<JsonArray>send("users", new JsonObject()
            .put("action", "find")
            .put("query", new JsonObject().put("emailAddress",
              context.user() == null ? new JsonObject() : authority.getEmail(context.user().principal()))),
          ar -> {
            if (ar.result() != null
              && ar.result().body() != null
              && ar.result().body().size() == 1
              && isAuthorized.test(ar.result().body().getJsonObject(0))) {
              handler.handle(context);
            } else {
              context.response().setStatusCode(403).end("You cannot access this!");
            }
          });
    };
  }

  private static class OperationHandlers {

    private final Handler<RoutingContext> handler;
    private final Handler<RoutingContext> failureHandler = FailureHandler::fallback;

    OperationHandlers(Handler<RoutingContext> handler) {
      this.handler = handler;
    }

    void getHandler(RoutingContext context) {
      handler.handle(context);
    }
  }
}
