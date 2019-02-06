package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import org.pmw.tinylog.Logger;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) throws Exception {
    Logger.info("config() -> " + config().getInteger("http.port", 8000));
    Logger.info("getenv() -> " + System.getenv("HTTP_PORT"));
    int port = config().getInteger("http.port", 8008);

    Router router = Router.router(vertx);
    router
      .get("/*")
      .handler(StaticHandler.create());
    router
      .get("/api/status")
      .handler(req -> req.response()
        .putHeader("content-type", "application/json")
        .end(new JsonObject().put("title", "Small Data Status").encode()));
    HttpServer server = vertx.createHttpServer().requestHandler(router);
    server.listen(port, http -> {
      if (http.succeeded()) {
        startFuture.complete();
        Logger.info("HTTP server started on http://localhost:" + port);
      } else {
        startFuture.fail(http.cause());
      }
    });
  }
}
