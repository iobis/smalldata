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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class UsersHandlerTest {

  private static final int HTTP_PORT = 8080;
  private static final JsonObject CONFIG = new JsonObject()
    .put("mode", "DEMO")
    .put("auth", new JsonObject().put("provider", "demo").put("demokey", "verysecret"))
    .put("http", new JsonObject().put("port", HTTP_PORT));
  private static final String LOCALHOST = "localhost";
  private static final String URL_API_USERS = "/api/users/";
  private static final String KEY_USERS_REF = "_ref";
  private static final String KEY_EMAIL_ADDRESS = "emailAddress";
  private static final String KEY_ROLE = "role";
  private static final String DEFAULT_EMAIL_ADDRESS = "another.user@domain.org";
  private static final String HEADER_AUTHORIZATION_KEY = "Authorization";
  private static final String HEADER_AUTHORIZATION_VALUE = "Basic verysecret";
  private static final String USERS_ADDRESS = "users";

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    info(vertx);
    vertx.deployVerticle(
      new HttpComponent(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void getUsers(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    vertx.eventBus().localConsumer(
      USERS_ADDRESS,
      message -> message.reply(new JsonArray().add(new JsonObject().put(KEY_USERS_REF, "some-user-ref"))));
    client
      .get(HTTP_PORT, LOCALHOST, URL_API_USERS)
      .putHeader(HEADER_AUTHORIZATION_KEY, HEADER_AUTHORIZATION_VALUE)
      .as(BodyCodec.jsonArray())
      .send(ar -> {
        try {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json).hasSize(1);
          assertThat(json.getJsonObject(0).getMap())
            .containsOnlyKeys(KEY_USERS_REF)
            .containsEntry(KEY_USERS_REF, "some-user-ref");
        } catch (AssertionError e) {
          context.failNow(e);
        }
        context.completeNow();
      });
  }

  @ParameterizedTest
  @ValueSource(strings = {"node manager", "researcher"})
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void postUserWithSupportedRoles(String role, Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    usersConsumer(vertx, new JsonArray()
      .add(new JsonObject()
        .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS)
        .put(KEY_ROLE, role)));
    client
      .post(HTTP_PORT, LOCALHOST, URL_API_USERS)
      .putHeader(HEADER_AUTHORIZATION_KEY, HEADER_AUTHORIZATION_VALUE)
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject()
          .put(KEY_ROLE, role)
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS),
        ar -> {
          try {
            assertThat(ar.succeeded()).isTrue();
            var json = ar.result().body();
            assertThat(json.getMap())
              .containsOnlyKeys(KEY_EMAIL_ADDRESS, KEY_ROLE)
              .containsEntry(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS);
          } catch (AssertionError e) {
            context.failNow(e);
          }
          context.completeNow();
        });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void postUserWithUnsupportedRole(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    usersConsumer(vertx);
    client
      .post(HTTP_PORT, LOCALHOST, URL_API_USERS)
      .putHeader(HEADER_AUTHORIZATION_KEY, HEADER_AUTHORIZATION_VALUE)
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject()
          .put(KEY_ROLE, "unknown role")
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS),
        ar -> {
          try {
            assertThat(ar.succeeded()).isTrue();
            var json = ar.result().body();
            assertThat(json.getMap())
              .containsOnlyKeys("timestamp", "exception", "exceptionMessage", "path")
              .containsEntry("exceptionMessage", "$.role: does not have a value in the enumeration [node manager, researcher]");
          } catch (AssertionError e) {
            context.failNow(e);
          }
          context.completeNow();
        });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void putUser(Vertx vertx, VertxTestContext context) {
    var client = WebClient.create(vertx);
    usersConsumer(vertx);
    client
      .put(HTTP_PORT, LOCALHOST, URL_API_USERS)
      .putHeader(HEADER_AUTHORIZATION_KEY, HEADER_AUTHORIZATION_VALUE)
      .as(BodyCodec.jsonObject())
      .sendJson(
        new JsonObject()
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS),
        ar -> {
          try {
            assertThat(ar.succeeded()).isTrue();
            var json = ar.result().body();
            assertThat(json.getMap())
              .containsOnlyKeys(KEY_EMAIL_ADDRESS)
              .containsEntry(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS);
            context.completeNow();
          } catch (AssertionError e) {
            context.failNow(e);
          }
          context.completeNow();
        });
  }

  private void usersConsumer(Vertx vertx) {
    usersConsumer(vertx, new JsonArray().add(new JsonObject().put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS)));
  }

  private void usersConsumer(Vertx vertx, JsonArray foundUsers) {
    vertx.eventBus().<JsonObject>localConsumer(
      USERS_ADDRESS,
      message -> {
        switch (message.body().getString("action")) {
          case "find":
            message.reply(foundUsers);
            break;
          case "insert":
          case "replace":
            message.reply(message.body().getJsonObject("user"));
            break;
          default:
            message.reply(new JsonObject());
            break;
        }
      });
  }
}
