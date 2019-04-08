package org.obis.smalldata.webapi;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class LoginHandlerTest {

  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG = new JsonObject().put("port", HTTP_PORT);

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new WebApi(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("check if a proper jwt is returned")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void startHttpServer(Vertx vertx, VertxTestContext testContext) {
    WebClient client = WebClient.create(vertx);
    client.post(HTTP_PORT, "localhost", "/api/login")
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject().put("username", "paulo").put("password", "secret"),
        result -> {
          if (result.succeeded()) {
            assertEquals(200, result.result().statusCode());
            JsonObject body = result.result().body();
            info(body);
            JWTAuth provider = JWTAuth.create(vertx, new JWTAuthOptions()
              .addPubSecKey(new PubSecKeyOptions()
                  .setAlgorithm("ES256")
                  .setPublicKey(
                    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEraVJ8CpkrwTPRCPluUDdwC6b8+m4\n" +
                      "dEjwl8s+Sn0GULko+H95fsTREQ1A2soCFHS4wV3/23Nebq9omY3KuK9DKw==\n")));
            provider.authenticate(new JsonObject().put("jwt", body.getString("token")),
              auth -> {
                var jwtClaims = (auth.result().principal());
                var now = Instant.now().toEpochMilli()/1000;
                assertEquals(jwtClaims.getString("sub"), "paulo");
                assertEquals(jwtClaims.getString("aud"), "occurrences-OBIS");
                assertTrue(jwtClaims.getInteger("iat") - now <= 0);
                assertTrue(jwtClaims.getInteger("iat") - now > -5);
                testContext.completeNow();
              });
          } else {
            testContext.failNow(result.cause());
          }
        });
  }
}
