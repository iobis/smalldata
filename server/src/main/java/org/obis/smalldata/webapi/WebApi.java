package org.obis.smalldata.webapi;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;

import java.util.function.Consumer;

import static org.pmw.tinylog.Logger.info;

public class WebApi extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    info("config() -> {}", config().getInteger("http.port", 8000));
    info("getenv() -> {}", System.getenv("HTTP_PORT"));
    var port = config().getInteger("http.port", 8008);

    OpenAPI3RouterFactory.create(vertx, "src/main/resources/swaggerroot/smalldata.yaml", ar -> {
      if (ar.succeeded()) {
        info("started OpenAPI: {}", ar.succeeded());
        new RouterConfig(startServer(startFuture, port)).invoke(ar.result());
      } else {
        info("failed to start api: {}", ar.cause());
      }
    });
  }

  private Consumer<Router> startServer(Future<Void> startFuture, int port) {
    return router -> {
      var server = vertx.createHttpServer().requestHandler(router);
      server.listen(port, http -> {
        if (http.succeeded()) {
          startFuture.complete();
          info("HTTP server started on http://localhost: {}", port);
        } else {
          info("Failed to start the server http://localhost:{}", port);
          startFuture.fail(http.cause());
        }
      });
    };
  }
}
