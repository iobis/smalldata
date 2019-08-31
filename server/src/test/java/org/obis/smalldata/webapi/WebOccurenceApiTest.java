package org.obis.smalldata.webapi;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class WebOccurenceApiTest extends DefaultHandlerTest {

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    info("starting with config: {}", CONFIG);
    vertx.deployVerticle(
      HttpComponent.class.getName(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("Test dwca")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void replyRssFile(Vertx vertx, VertxTestContext testContext) {
    WebClient client = WebClient.create(vertx);
    httpPostJsonBody(client, "/api/dwca",
      new JsonObject(),
      result -> {
        info(result);
        testContext.completeNow();
      });
  }
}
