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

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class UsersHandlerTest {

  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG = new JsonObject().put("port", HTTP_PORT);
  private static final String LOCALHOST = "localhost";
  private static final String URL_API_USERS = "/api/users/";
  private static final String KEY_USERS_REF = "_ref";
  private static final String KEY_EMAIL_ADDRESS = "emailAddress";
  private static final String DEFAULT_EMAIL_ADDRESS = "my.name@organization.ours";

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    info(vertx);
    vertx.deployVerticle(
      new HttpComponent(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("users get handler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testGetHandler(Vertx vertx, VertxTestContext context) {

    var client = WebClient.create(vertx);
    var url = URL_API_USERS;
    vertx.eventBus().localConsumer(
      "users",
      message -> message.reply(new JsonArray().add(new JsonObject().put(KEY_USERS_REF, "some-user-ref"))));
    client
      .get(HTTP_PORT, LOCALHOST, url)
      .as(BodyCodec.jsonArray())
      .send(ar -> {
        assertThat(ar.succeeded()).isTrue();
        var json = ar.result().body();
        assertThat(json).hasSize(1);
        assertThat(json.getJsonObject(0).containsKey(KEY_USERS_REF)).isTrue();
        assertThat(json.getJsonObject(0).getString(KEY_USERS_REF)).isEqualTo("some-user-ref");
        context.completeNow();
      });
  }

  @Test
  @DisplayName("users post handler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandler(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    var url = URL_API_USERS;
    vertx.eventBus().localConsumer(
      "users",
      message -> message.reply(((JsonObject) message.body()).getJsonObject("user")));
    client
      .post(HTTP_PORT, LOCALHOST, url)
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject()
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json.containsKey(KEY_EMAIL_ADDRESS)).isTrue();
          assertThat(json.getString(KEY_EMAIL_ADDRESS)).isEqualTo(DEFAULT_EMAIL_ADDRESS);
          context.completeNow();
        });
  }

  @Test
  @DisplayName("users put handler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPutHandler(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    var url = URL_API_USERS;
    vertx.eventBus().localConsumer(
      "users",
      message -> message.reply(((JsonObject) message.body()).getJsonObject("user")));
    client
      .put(HTTP_PORT, LOCALHOST, url)
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject()
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS),
        ar -> {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json.containsKey(KEY_EMAIL_ADDRESS)).isTrue();
          assertThat(json.getString(KEY_EMAIL_ADDRESS)).isEqualTo(DEFAULT_EMAIL_ADDRESS);
          context.completeNow();
        });
  }
}
