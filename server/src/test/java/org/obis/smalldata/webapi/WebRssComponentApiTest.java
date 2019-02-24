package org.obis.smalldata.webapi;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
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
import org.pmw.tinylog.Logger;
import util.IoFile;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(VertxExtension.class)
public class WebRssComponentApiTest {

  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG = new JsonObject().put("http.port", HTTP_PORT);

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new WebApi(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
    vertx.deployVerticle(new MockRssComponent());
  }

  @Test
  @DisplayName("Test rss handling")
  @Timeout(value = 1, timeUnit = TimeUnit.SECONDS)
  void replyRssFile(Vertx vertx, VertxTestContext testContext) {
    WebClient client = WebClient.create(vertx);
    client.get(HTTP_PORT, "localhost", "/api/rss/weekly")
      .as(BodyCodec.string())
      .send(result -> {
        if (result.succeeded()) {
          assertEquals(200, result.result().statusCode());
          var resultString = result.result().body();
          IoFile.doWithFileContent("rss/sample.xml",
            xmlString -> {
              assertEquals(resultString.replaceAll("\\n", ""),
                xmlString.replaceAll("\\n", ""));
              testContext.completeNow();
            });
        }
      });
  }

  class MockRssComponent extends AbstractVerticle {
    @Override
    public void start(Future<Void> startFuture) throws Exception {
      vertx.eventBus().consumer("internal.rss", message -> {
        Logger.info("Got message: {}", message.body());
        message.reply("rss/sample.xml");
      });
    }
  }
}