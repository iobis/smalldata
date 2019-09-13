package org.obis.smalldata.webapi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.ext.web.client.WebClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.util.file.IoFile;

@ExtendWith(VertxExtension.class)
public class WebRssComponentApiTest extends DefaultHandlerTest {

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
        new HttpComponent(),
        new DeploymentOptions().setConfig(CONFIG),
        testContext.succeeding(id -> testContext.completeNow()));
    vertx.deployVerticle(new MockRssComponent());
  }

  @Test
  @DisplayName("Test rss handling")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void replyRssFile(Vertx vertx, VertxTestContext testContext) {
    WebClient client = WebClient.create(vertx);
    httpGetString(
        client,
        "/api/rss/weekly",
        result -> {
          assertTrue(result.succeeded());
          assertEquals(200, result.result().statusCode());
          assertEquals(IoFile.loadFromResources("rss/sample.xml"), result.result().body());
          testContext.completeNow();
        });
  }

  static class MockRssComponent extends AbstractVerticle {
    @Override
    public void start(Future<Void> startFuture) {
      vertx
          .eventBus()
          .consumer(
              "internal.rss",
              message -> {
                info("Got message: {}", message.body());
                message.reply("rss/sample.xml");
              });
    }
  }
}
