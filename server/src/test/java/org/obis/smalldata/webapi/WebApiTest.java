package org.obis.smalldata.webapi;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(VertxExtension.class)
public class WebApiTest {

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new WebApi(),
      new DeploymentOptions().setConfig(new JsonObject().put("http.port", 8080)),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("starts a http server on port 8080")
  @Timeout(value = 10, timeUnit = TimeUnit.SECONDS)
  void startHttpServer(Vertx vertx, VertxTestContext testContext) {
    WebClient client = WebClient.create(vertx);
    client.get(8080, "localhost", "/api/status")
      .as(BodyCodec.jsonObject())
      .send(result -> {
        if (result.succeeded()) {
          assertEquals(200, result.result().statusCode());
          JsonObject body = result.result().body();
          assertTrue(body.containsKey("title"));
          assertTrue(body.getString("title").contains("Small Data"));
          testContext.completeNow();
        } else {
          testContext.failNow(result.cause());
        }
      });
  }
}
