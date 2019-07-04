package org.obis.smalldata.webapi;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;

import java.util.function.Consumer;

import static org.pmw.tinylog.Logger.info;

public class HttpComponent extends AbstractVerticle {

  private static final String VERIFY_KEY = "verifyKey";
  private static final String SIGN_KEY = "signKey";
  private static final String ALG_KEY = "alg";
  private static final String AUTH_ES256 = "ES256";

  @Override
  public void start(Future<Void> startFuture) {
    info("starting module 'webapi': {}", config().encodePrettily());
    var port = config().getJsonObject("http").getInteger("port", 8008);
    OpenAPI3RouterFactory.create(vertx, "swaggerroot/spec/smalldata-bundled.yaml",
      ar -> {
        if (ar.succeeded()) {
          info("started OpenAPI: {}", ar.succeeded());
          var authConfig = config().getJsonObject("auth");
          var pubSecKey = new PubSecKeyOptions()
            .setAlgorithm(authConfig.getString(ALG_KEY, AUTH_ES256))
            .setPublicKey(authConfig.getString(VERIFY_KEY));
          var jwtAuth = JWTAuth.create(vertx, new JWTAuthOptions().addPubSecKey(pubSecKey));
          new RouterConfig(startServer(startFuture, port), jwtAuth).invoke(ar.result());
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
          info("HTTP server started on http://localhost:{}", port);
        } else {
          info("Failed to start the server http://localhost:{}", port);
          startFuture.fail(http.cause());
        }
      });
    };
  }
}
