package org.obis.smalldata;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.HttpResponse;
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
public class TestMainVerticle {

  @BeforeEach
  void deploy_verticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new Starter(),
      new DeploymentOptions()
        .setConfig(new JsonObject().put("http.port", 8080)),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("Should start a Web Server on port 8080")
  @Timeout(value = 10, timeUnit = TimeUnit.SECONDS);
  void start_http_server(Vertx vertx, VertxTestContext testContext) {
    vertx.createHttpClient().getNow(8080, "localhost", "/api/status", response -> testContext.verify(() -> {
      assertEquals(200, response.statusCode());
      response.handler(body -> {
        assertTrue(body.toJsonObject().containsKey("title"));
        assertTrue(body.toJsonObject().getString("title").contains("Small Data"));
        testContext.completeNow();
      });
    }));
  }
}
