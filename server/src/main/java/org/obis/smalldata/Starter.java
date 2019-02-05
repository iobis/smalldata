package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) throws Exception {
    System.out.println("config() -> " + config().getInteger("http.port", 8000));
    System.out.println("getenv() -> " + System.getenv("HTTP_PORT"));
    int port = config().getInteger("http.port", 8008);

    Router router = Router.router(vertx);
    router.get("/smalldata/*").handler(StaticHandler.create());

    HttpServer server = vertx.createHttpServer().requestHandler(router);
    server.listen(port, http -> {
      if (http.succeeded()) {
        startFuture.complete();
        System.out.println("HTTP server started on http://localhost:" + port);
      } else {
        startFuture.fail(http.cause());
      }
    });
  }
}
