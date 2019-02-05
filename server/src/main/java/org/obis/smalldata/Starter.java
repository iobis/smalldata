package org.obis.smalldata;

import io.vertx.config.ConfigRetriever;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.json.JsonObject;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) throws Exception {
    System.out.println("config() -> " + config().getInteger("http.port", 8080));
    System.out.println("getenv() -> " + System.getenv("HTTP_PORT"));
    int port = config().getInteger("http.port", 8080);
    vertx.createHttpServer().requestHandler(req -> {
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    }).listen(port, http -> {
      if (http.succeeded()) {
        startFuture.complete();
        System.out.println("HTTP server started on http://localhost:" + port);
      } else {
        startFuture.fail(http.cause());
      }
    });
  }

  public static void main(String... args) {
    Vertx vertx = Vertx.vertx();
    ConfigRetriever retriever = ConfigRetriever.create(vertx);

    retriever.getConfig(json -> {
      JsonObject result = json.result();
      vertx.close();

      VertxOptions options = new VertxOptions(result);
      Vertx newVertx = Vertx.vertx(options);

      newVertx.deployVerticle(Starter.class.getName(), new DeploymentOptions().setConfig(result));
    });
  }

}
