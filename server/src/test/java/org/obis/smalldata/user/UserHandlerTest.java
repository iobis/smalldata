package org.obis.smalldata.user;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class UserHandlerTest {

  private static final String KEY_ACTION = "action";
  private static TestDb testDb;

  @BeforeAll
  public static void deployVerticle(Vertx vertx, VertxTestContext testContext) {
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

  @AfterAll
  public static void stop() {
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
            .filter(user -> user.getString("_ref").equals("ovZTtaOJZ98xDDY"))
            .findFirst()
            .get();
          assertThat(userjson.getJsonArray("dataset_refs")).hasSize(4);
          assertThat(userjson.getJsonArray("dataset_refs"))
            .containsExactly("wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w", "NnqVLwIyPn-nRkc");
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

}
