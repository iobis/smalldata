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

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class UserHandlerTest {

  private static final String KEY_ACTION = "action";
  private static final String KEY_BULKINESS = "bulkiness";
  private static final String KEY_DATASET_REFS = "dataset_refs";
  private static final String KEY_EMAIL_ADDRESS = "emailAddress";
  private static final String KEY_REF = "_ref";
  private static final String KEY_VALUE = "value";
  private static final String QUERY_REF = "ref";
  private static final String DEFAULT_EMAIL_ADDRESS = "my.user@domain.org";
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
          var body = ar.result().body();
          assertThat(body).hasSize(2);
          var user = body.stream()
            .map(JsonObject.class::cast)
            .filter(u -> u.getString(KEY_REF).equals("ovZTtaOJZ98xDDY"))
            .findFirst()
            .orElseThrow();
          assertThat(user.getJsonArray(KEY_DATASET_REFS))
            .hasSize(4)
            .containsExactly("wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w", "NnqVLwIyPn-nRkc");
          assertThat(user.containsKey(KEY_BULKINESS)).isTrue();
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
      new JsonObject(Map.of(
        KEY_ACTION, "find",
        "query", new JsonObject().put(KEY_EMAIL_ADDRESS, "some.user@domain.org"))),
      ar -> {
        if (ar.succeeded()) {
          var body = ar.result().body();
          assertThat(body).hasSize(1);
          var user = body.stream()
            .map(JsonObject.class::cast)
            .filter(u -> u.getString(KEY_REF).equals("ovZTtaOJZ98xDDY"))
            .findFirst()
            .orElseThrow();
          assertThat(user.getJsonArray(KEY_DATASET_REFS))
            .hasSize(4)
            .containsExactly("wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w", "NnqVLwIyPn-nRkc");
          assertThat(user.containsKey(KEY_BULKINESS)).isTrue();
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
      new JsonObject(Map.of(
        KEY_ACTION, "insert",
        "user", new JsonObject().put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var body = ar.result().body();
          assertThat(body.getMap())
            .containsOnlyKeys(KEY_REF, KEY_EMAIL_ADDRESS, KEY_BULKINESS)
            .containsEntry(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS);
          assertThat(body.getJsonObject(KEY_BULKINESS).getDouble(KEY_VALUE))
            .isEqualTo(0.0);
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void insertUserWithDefaultBulkiness(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      Collections.USERS.dbName(),
      new JsonObject(Map.of(
        KEY_ACTION, "insert",
        "user", new JsonObject()
          .put(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS)
          .put(KEY_BULKINESS, new JsonObject()
            .put("instant", Instant.now())
            .put(KEY_VALUE, Math.E)))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var body = ar.result().body();
          assertThat(body.getMap())
            .containsOnlyKeys(KEY_REF, KEY_EMAIL_ADDRESS, KEY_BULKINESS)
            .containsEntry(KEY_EMAIL_ADDRESS, DEFAULT_EMAIL_ADDRESS);
          assertThat(body.getJsonObject(KEY_BULKINESS).getDouble(KEY_VALUE))
            .isEqualTo(Math.E);
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
        "user", new JsonObject()
          .put(KEY_EMAIL_ADDRESS, "my.otheruser@domain.com")
          .put(KEY_BULKINESS, new JsonObject()
            .put("instant", Instant.now())
            .put(KEY_VALUE, Math.PI)))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var body = ar.result().body();
          assertThat(body.getMap())
            .containsOnlyKeys(QUERY_REF, KEY_EMAIL_ADDRESS, KEY_BULKINESS)
            .containsEntry(KEY_EMAIL_ADDRESS, "my.otheruser@domain.com");
          assertThat((body.getJsonObject(KEY_BULKINESS)).getDouble(KEY_VALUE))
            .isEqualTo(Math.PI);
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testIncreaseBulkiness(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "users.bulkiness",
      new JsonObject()
        .put("action", "increase")
        .put("userRef", "FsfEMwhUTO_8I68"),
      ar -> {
        var bulkiness = ar.result().body().getJsonObject("bulkiness");
        assertThat(bulkiness.getDouble("value")).isGreaterThan(1.0);
        assertThat(bulkiness.getInstant("instant")).isBetween(Instant.now().minusMillis(200), Instant.now());
        testContext.completeNow();
      });
  }
}
