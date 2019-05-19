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
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaTest {

  private static final JsonObject DWCA_OCCURRENCE_RECORD = new JsonObject().put("core", "occurrence")
    .put("occurrence", new JsonArray()
      .add(new JsonObject().put("iobis", new JsonObject())))
    .put("emof", new JsonArray()
      .add(new JsonObject().put("purl", new JsonObject())
        .put("iobis", new JsonObject()))
      .add(new JsonObject().put("iobis", new JsonObject())));
  private static TestDb testDb;

  @BeforeAll
  public static void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);
    vertx.sharedData().getLocalMap("settings")
      .putAll(Map.of("storage", new JsonObject()
        .put("host", "localhost")
          .put("port", 12345)
          .put("path", ""),
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
  @DisplayName("add a new dwca record")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void testAddDwcaRecord(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "dwca.record",
      new JsonObject()
        .put("action", "insert")
        .put("userRef", "someuser")
        .put("datasetRef", "NnqVLwIyPn-nRkc")
        .put("record", DWCA_OCCURRENCE_RECORD),
      ar -> {
        if (ar.succeeded()) {
          JsonObject body = ar.result().body();
          info(body);
          assertThat(body.getJsonObject("records").getJsonArray("occurrence").size()).isEqualTo(1);
          assertThat(body.getJsonObject("records").getJsonArray("emof").size()).isEqualTo(2);
          testContext.completeNow();
        } else {
          error("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }
}
