package org.obis.smalldata.webapi;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
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
import org.obis.smalldata.util.SecureRandomString;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class DwcaRecordsHandlerTest {

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
  @DisplayName("dwca record post handler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandler(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    var url = "/api/dwca/wEaBfmFyQhYCdsk/user/"
      + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records";
    vertx.eventBus().localConsumer("dwca.record", message ->
      message.reply(new JsonObject().put("dwcaId", SecureRandomString.generateId())));

    client.post(HTTP_PORT, "localhost", url)
      .as(BodyCodec.jsonObject())
      .sendJson(new JsonObject().put("core", "occurrence")
          .put("occurrence", new JsonArray()),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          var reply = ar.result().body();
          assertThat(reply.containsKey("dwcaId")).isTrue();
          assertThat(reply.getString("dwcaId")).hasSize(15);
          context.completeNow();
        });
  }
}
