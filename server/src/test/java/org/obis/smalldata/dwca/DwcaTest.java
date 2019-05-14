package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaTest {

  private static TestDb testDb;

  @BeforeAll
  public static void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);
    var storageSetting = new JsonObject()
      .put("host", "localhost")
      .put("port", 12345)
      .put("path", "");
    vertx.sharedData().getLocalMap("settings").putAll(
      Map.of(
        "storage", storageSetting,
        "baseUrl", "https://my.domain.org/"));
    vertx.deployVerticle(
      Dwca.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterAll
  public static void stop() {
    testDb.shutDown();
  }

  @Test
  @DisplayName("check if a valid dwca zip file is generated")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void testGenerateZipFile(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "dwca",
      new JsonObject()
        .put("action", "generate")
        .put("findDataset", "NnqVLwIyPn-nRkc"),
      ar -> {
        if (ar.succeeded()) {
          JsonObject body = ar.result().body();
          info("success {}", body);
          testContext.completeNow();
        } else {
          info("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @DisplayName("get records for user")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void testRecordsForUser(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "dwca",
      new JsonObject()
        .put("action", "recordsForUser")
        .put("userRef", "FsfEMwhUTO_8I68"),
      ar -> {
        if (ar.succeeded()) {
          JsonArray body = ar.result().body();
          info("success {}", body);
          assertThat(body.stream().map(JsonObject.class::cast).anyMatch(rec -> rec.containsKey("_id"))).isFalse();
          assertThat(body.size()).isEqualTo(2310);
          testContext.completeNow();
        } else {
          info("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @DisplayName("get one dwca record for a user")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void testRecordForUser(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "dwca",
      new JsonObject()
        .put("action", "recordForUser")
        .put("userRef", "FsfEMwhUTO_8I68")
        .put("dwcaId", "IBSS_R/V N. Danilevskiy 1935 Azov Sea benthos data_338"),
      ar -> {
        if (ar.succeeded()) {
          var body = ar.result().body();
          info("success {}", body);
          assertThat(body.getString("_ref")).isEqualTo("YVSglL8OxJeUDkw");
          testContext.completeNow();
        } else {
          info("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }
}
