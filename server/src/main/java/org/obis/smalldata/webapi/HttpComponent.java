package org.obis.smalldata.webapi;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AbstractUser;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.User;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.handler.JWTAuthHandler;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import org.obis.smalldata.webapi.authority.Authority;
import org.obis.smalldata.webapi.authority.DemoAuthority;
import org.obis.smalldata.webapi.authority.LocalAuthority;
import org.obis.smalldata.webapi.authority.OceanExpertAuthority;

public class HttpComponent extends AbstractVerticle {

  private static final String VERIFY_KEY = "verifyKey";
  private static final String ALG_KEY = "alg";
  private static final String AUTH_ES256 = "ES256";
  private static final Map<String, Authority> AUTHORITIES =
      Map.of(
          "oceanexpert", new OceanExpertAuthority(),
          "demo", new DemoAuthority(),
          "local", new LocalAuthority());

  @Override
  public void start(Future<Void> startFuture) {
    info("starting module 'webapi': {}", config().encodePrettily());
    var port = config().getJsonObject("http").getInteger("port", 8008);
    OpenAPI3RouterFactory.create(
        vertx,
        "swaggerroot/spec/smalldata-bundled.yaml",
        ar -> {
          if (ar.succeeded()) {
            info("started OpenAPI: {}", ar.succeeded());
            var authConfig = config().getJsonObject("auth");
            var authProvider = authConfig.getString("provider", "");
            var pubSecKey =
                new PubSecKeyOptions()
                    .setAlgorithm(authConfig.getString(ALG_KEY, AUTH_ES256))
                    .setPublicKey(authConfig.getString(VERIFY_KEY));
            var jwtAuth = JWTAuth.create(vertx, new JWTAuthOptions().addPubSecKey(pubSecKey));
            new RouterConfig(
                    startServer(startFuture, port),
                    AUTHORITIES.getOrDefault(authProvider, new OceanExpertAuthority()),
                    Map.of(
                        "demoApiKey",
                        new DemoApiKeyHandler(config())::handle,
                        "oceanExpertJWT",
                        JWTAuthHandler.create(jwtAuth)))
                .invoke(ar.result());
          } else {
            info("failed to start api: {}", ar.cause());
          }
        });
  }

  private Consumer<Router> startServer(Future<Void> startFuture, int port) {
    return router -> {
      var server = vertx.createHttpServer().requestHandler(router);
      server.listen(
          port,
          httpServer -> {
            if (httpServer.succeeded()) {
              info("HTTP server started on http://localhost:{}", port);
              startFuture.complete();
            } else {
              error(
                  httpServer.cause(),
                  "HTTP server failed to start on http://localhost:{}",
                  port,
                  httpServer.cause());
              startFuture.fail(httpServer.cause());
            }
          });
    };
  }

  private static class DemoApiKeyHandler {

    private final Function<String, User> dummyUser =
        role ->
            new AbstractUser() {
              @Override
              protected void doIsPermitted(
                  String permission, Handler<AsyncResult<Boolean>> resultHandler) {}

              @Override
              public JsonObject principal() {
                return new JsonObject().put("user", "DEMO").put("role", role);
              }

              @Override
              public void setAuthProvider(AuthProvider authProvider) {}
            };
    private final boolean isDemoMode;
    private final String secret;

    DemoApiKeyHandler(JsonObject config) {
      this.isDemoMode = config.getString("mode").equals("DEMO");
      this.secret = "Basic " + config.getJsonObject("auth").getString("demokey");
    }

    private void handle(RoutingContext routingContext) {
      if (isDemoMode
          && routingContext.request().headers().get("Authorization") != null
          && routingContext.request().headers().get("Authorization").equals(secret)) {
        routingContext.setUser(dummyUser.apply("researcher"));
      }
      routingContext.next();
    }
  }
}
