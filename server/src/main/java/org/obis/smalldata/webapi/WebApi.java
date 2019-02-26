package org.obis.smalldata.webapi;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.function.Consumer;

public class WebApi extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    Logger.info("config() -> {}", config().getInteger("http.port", 8000));
    Logger.info("getenv() -> {}", System.getenv("HTTP_PORT"));
    var port = config().getInteger("http.port", 8008);

    OpenAPI3RouterFactory.create(vertx,
      new File(getClass().getResource("/swaggerroot/smalldata.yaml").getPath()).getAbsolutePath(),
      ar -> {
        if (ar.succeeded()) {
          Logger.info("started OpenAPI: {}", ar.succeeded());
          new RouterConfig(startServer(startFuture, port)).invoke(ar.result());
        } else {
          Logger.info("failed to start api: {}", ar.cause());
        }
      });
  }

  Consumer<Router> startServer(Future<Void> startFuture, int port) {
    return router -> {
      var server = vertx.createHttpServer().requestHandler(router);
      server.listen(port, http -> {
        if (http.succeeded()) {
          startFuture.complete();
          Logger.info("HTTP server started on http://localhost: {}", port);
        } else {
          Logger.info("Failed to start the server http://localhost:{}", port);
          startFuture.fail(http.cause());
        }
      });
    };
  }
}
