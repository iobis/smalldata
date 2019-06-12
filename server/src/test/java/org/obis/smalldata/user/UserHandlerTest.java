package org.obis.smalldata.user;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;
import org.obis.smalldata.util.Collections;

import java.util.AbstractMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class UserHandlerTest {

  private static final String KEY_ACTION = "action";
  private static final String KEY_DATASET_REFS = "dataset_refs";
  private static final String KEY_EMAIL_ADDRESS = "emailAddress";
  private static final String KEY_REF = "_ref";
  private TestDb testDb;

  @BeforeEach
  public void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);
    vertx.sharedData().getLocalMap("settings")
      .putAll(Map.of(
        "storage",
        new JsonObject(Map.of(
          "host", "localhost",
          "port", 12345,
          "path", "")),
        "baseUrl", "https://my.domain.org/"));
    vertx.deployVerticle(
      UserComponent.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterEach
  public void stop() {
    testDb.shutDown();
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void findAllUsers(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "users",
      new JsonObject(Map.of(KEY_ACTION, "find")),
      ar -> {
        if (ar.succeeded()) {
          JsonArray records = ar.result().body();
          assertThat(records).hasSize(2);
          JsonObject userjson = records.stream()
            .map(JsonObject.class::cast)
            .filter(user -> user.getString(KEY_REF).equals("ovZTtaOJZ98xDDY"))
            .findFirst()
            .get();
          assertThat(userjson.getJsonArray(KEY_DATASET_REFS)).hasSize(4);
          assertThat(userjson.getJsonArray(KEY_DATASET_REFS))
            .containsExactly("wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w", "NnqVLwIyPn-nRkc");
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void findUserByEmail(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "users",
      new JsonObject(Map.of(KEY_ACTION, "find",
      "query", new JsonObject().put(KEY_EMAIL_ADDRESS, "some.user@domain.org"))),
      ar -> {
        if (ar.succeeded()) {
          JsonArray records = ar.result().body();
          assertThat(records).hasSize(1);
          JsonObject userjson = records.stream()
            .map(JsonObject.class::cast)
            .filter(user -> user.getString(KEY_REF).equals("ovZTtaOJZ98xDDY"))
            .findFirst()
            .get();
          assertThat(userjson.getJsonArray(KEY_DATASET_REFS)).hasSize(4);
          assertThat(userjson.getJsonArray(KEY_DATASET_REFS))
            .containsExactly("wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w", "NnqVLwIyPn-nRkc");
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void insertUser(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      Collections.USERS.dbName(),
      new JsonObject(Map.of(KEY_ACTION, "insert",
      "user", new JsonObject()
          .put(KEY_EMAIL_ADDRESS, "my.user@domain.org"))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json).contains(new AbstractMap.SimpleEntry(KEY_EMAIL_ADDRESS, "my.user@domain.org"));
          assertThat(json.containsKey(KEY_REF)).isTrue();
          assertThat(json.containsKey("_id")).isFalse();
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void replaceUser(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      Collections.USERS.dbName(),
      new JsonObject(Map.of(
        KEY_ACTION, "replace",
        "userRef", "FsfEMwhUTO_8I68",
        "user", new JsonObject().put(KEY_EMAIL_ADDRESS, "my.otheruser@domain.com"))),
      ar -> {
        if (ar.succeeded()) {
          info(ar.cause());
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          info(json);
          assertThat(json).contains(new AbstractMap.SimpleEntry(KEY_EMAIL_ADDRESS, "my.otheruser@domain.com"));
          assertThat(json.containsKey(KEY_REF)).isTrue();
          assertThat(json.containsKey("_id")).isFalse();
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }
}
