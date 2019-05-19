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
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaRecordsHandlerTest {

  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG = new JsonObject().put("port", HTTP_PORT);
  private static final String OCCURRENCE = "occurrence";

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
    addSucceedingRefs(vertx);

    var client = WebClient.create(vertx);
    var url = "/api/dwca/wEaBfmFyQhYCdsk/user/"
      + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records";
    vertx.eventBus().localConsumer("dwca.record", message ->
      message.reply(new JsonObject().put("dwcaId", SecureRandomString.generateId())));
    client.post(HTTP_PORT, "localhost", url)
      .as(BodyCodec.jsonObject())
      .sendJson(new JsonObject().put("core", OCCURRENCE)
          .put(OCCURRENCE, new JsonArray().add(new JsonObject())),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          var reply = ar.result().body();
          assertThat(reply.containsKey("dwcaId")).isTrue();
          assertThat(reply.getString("dwcaId")).hasSize(15);
          context.completeNow();
        });
  }

  @Test
  @DisplayName("message if more than 1 record in the core table")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandlerTooManyRecordsInCoreTable(Vertx vertx, VertxTestContext context) {
    addSucceedingRefs(vertx);

    var client = WebClient.create(vertx);
    var url = "/api/dwca/wEaBfmFyQhYCdsk/user/"
      + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records";
    client.post(HTTP_PORT, "localhost", url)
      .as(BodyCodec.jsonObject())
      .sendJson(new JsonObject().put("core", OCCURRENCE)
          .put(OCCURRENCE, new JsonArray().add(new JsonObject()).add(new JsonObject())),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          assertThat(ar.result().statusCode()).isEqualTo(422);
          assertThat(ar.result().statusMessage()).isEqualTo("Invalid request body");
          assertThat(ar.result().body().getJsonArray("messages")).hasSize(1);
          context.completeNow();
        });
  }

  @Test
  @DisplayName("multiple messages: no item in occurrence, wrong userRef")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandlerMultipleMessages(Vertx vertx, VertxTestContext context) {
    addItemRefs(vertx, true, false);

    var client = WebClient.create(vertx);
    var url = "/api/dwca/wEaBfmFyQhYCdsk/user/"
      + URLEncoder.encode("whatever", StandardCharsets.UTF_8)
      + "/records";
    client.post(HTTP_PORT, "localhost", url)
      .as(BodyCodec.jsonObject())
      .sendJson(new JsonObject().put("core", OCCURRENCE)
          .put(OCCURRENCE, new JsonArray()),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          assertThat(ar.result().statusCode()).isEqualTo(422);
          assertThat(ar.result().statusMessage()).isEqualTo("Invalid request body");
          assertThat(ar.result().body().getJsonArray("messages")).hasSize(2);
          context.completeNow();
        });
  }

  private void addItemRefs(Vertx vertx, Boolean datasetRef, Boolean userRef) {
    vertx.eventBus().localConsumer("datasets.exists", ar -> {
      info(ar.body());
      ar.reply(datasetRef);
    });
    vertx.eventBus().localConsumer("users.exists", ar -> {
      info(ar.body());
      ar.reply(userRef);
    });
  }

  private void addSucceedingRefs(Vertx vertx) {
    addItemRefs(vertx, true, true);
  }

}
