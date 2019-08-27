package org.obis.smalldata.webapi;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClient;
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
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaRecordsHandlerTest extends DefaultHandlerTest {

  private static final String OCCURRENCE = "occurrence";
  private static final String DEFAULT_DWCA_REF = "wEaBfmFyQhYCdsk";
  private static final String URL_API_DWCA = "/api/dwca/";
  private static final String PATH_USER = "/user/";
  private static final String KEY_DWCA_ID = "dwcaId";
  private static final String KEY_EMAIL_ADDRESS = "emailAddress";
  private static final String DEFAULT_EMAIL_ADDRESS = "another.user@domain.org";
  private static final String USERS_ADDRESS = "users";

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new HttpComponent(),
      new DeploymentOptions().setConfig(CONFIG),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @Test
  @DisplayName("dwca record get getHandler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testGetHandler(Vertx vertx, VertxTestContext context) {
    addSucceedingRefs(vertx);
    usersConsumer(vertx);

    var client = WebClient.create(vertx);
    var url = URL_API_DWCA + DEFAULT_DWCA_REF + PATH_USER + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records/somerecord";
    info(url);
    vertx.eventBus().localConsumer(
      "dwca.record",
      message -> message.reply(new JsonArray().add(new JsonObject().put(KEY_DWCA_ID, SecureRandomString.generateId()))));
    httpGetJsonBody(client, url, ar -> {
      assertThat(ar.succeeded()).isTrue();
      var json = ar.result().body();
      info(json);
      assertThat(json.containsKey(KEY_DWCA_ID)).isTrue();
      assertThat(json.getString(KEY_DWCA_ID)).hasSize(15);
      context.completeNow();
    });
  }

  @Test
  @DisplayName("dwca record post getHandler")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandler(Vertx vertx, VertxTestContext context) {
    addSucceedingRefs(vertx);
    usersConsumer(vertx);

    var client = WebClient.create(vertx);
    var url = URL_API_DWCA + DEFAULT_DWCA_REF + PATH_USER
      + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records";
    vertx.eventBus().localConsumer(
      "dwca.record",
      message -> message.reply(new JsonObject().put(KEY_DWCA_ID, SecureRandomString.generateId())));
    httpPostJsonBody(client, url, new JsonObject(Map.of(
      "core", OCCURRENCE,
      OCCURRENCE, new JsonArray().add(new JsonObject()))),
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        var json = ar.result().body();
        assertThat(json.containsKey(KEY_DWCA_ID)).isTrue();
        assertThat(json.getString(KEY_DWCA_ID)).hasSize(15);
        context.completeNow();
      });
  }

  @Test
  @DisplayName("message if more than 1 record in the core table")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandlerTooManyRecordsInCoreTable(Vertx vertx, VertxTestContext context) {
    addSucceedingRefs(vertx);
    usersConsumer(vertx);

    var client = WebClient.create(vertx);
    var url = URL_API_DWCA + DEFAULT_DWCA_REF + PATH_USER
      + URLEncoder.encode("dithras@game.play", StandardCharsets.UTF_8)
      + "/records";
    httpPostJsonBody(client, url, new JsonObject(Map.of(
      "core", OCCURRENCE,
      OCCURRENCE, new JsonArray(List.of(new JsonObject(), new JsonObject())))),
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        assertThat(ar.result().statusCode()).isEqualTo(422);
        assertThat(ar.result().statusMessage()).isEqualTo("Invalid request body");
        assertThat(ar.result().body().getJsonArray("messages")).containsOnly(
          "core table 'occurrence' can have only 1 record.");
        context.completeNow();
      });
  }

  @Test
  @DisplayName("multiple messages: no item in occurrence, wrong userRef")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testPostHandlerMultipleMessages(Vertx vertx, VertxTestContext context) {
    addItemRefs(vertx, false);
    usersConsumer(vertx);

    var client = WebClient.create(vertx);
    var url = URL_API_DWCA + DEFAULT_DWCA_REF + PATH_USER
      + URLEncoder.encode("whatever", StandardCharsets.UTF_8)
      + "/records";
    httpPostJsonBody(client, url, new JsonObject().put("core", OCCURRENCE)
        .put(OCCURRENCE, new JsonArray()),
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        assertThat(ar.result().statusCode()).isEqualTo(422);
        assertThat(ar.result().statusMessage()).isEqualTo("Invalid request body");
        assertThat(ar.result().body().getJsonArray("messages")).containsExactly(
          "core table 'occurrence' can have only 1 record.",
          "user with ref 'whatever' does not exist.");
        context.completeNow();
      });
  }

  private void addSucceedingRefs(Vertx vertx) {
    addItemRefs(vertx, true);
  }

  private void addItemRefs(Vertx vertx, boolean userRef) {
    vertx.eventBus().localConsumer("datasets.exists", ar -> {
      info(ar.body());
      ar.reply(true);
    });
    vertx.eventBus().localConsumer("users.exists", ar -> {
      info(ar.body());
      ar.reply(userRef);
    });
  }

  private void usersConsumer(Vertx vertx) {
    vertx.eventBus().<JsonObject>localConsumer(
      USERS_ADDRESS,
      message -> {
        switch (message.body().getString("action")) {
          case "find":
            message.reply(new JsonArray().add(new JsonObject().put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS)));
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
