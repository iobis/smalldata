package org.obis.smalldata.dwca;

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

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaComponentTest {

  private static final String OCCURRENCE = "occurrence";
  private static final JsonObject DWCA_OCCURRENCE_RECORD = new JsonObject()
    .put("core", OCCURRENCE)
    .put(OCCURRENCE, new JsonArray()
      .add(new JsonObject().put("iobis", new JsonObject())))
    .put("emof", new JsonArray()
      .add(new JsonObject().put("purl", new JsonObject()).put("iobis", new JsonObject()))
      .add(new JsonObject().put("iobis", new JsonObject())));
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
      DwcaComponent.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterAll
  public static void stop() {
    testDb.shutDown();
  }

  @Test
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void generateZipFile(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "dwca",
      new JsonObject(Map.of(
        "action", "generate",
        "findDataset", "NnqVLwIyPn-nRkc"
      )),
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
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void insertDwcaRecord(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      "dwca.record",
      new JsonObject(Map.of(
        "action", "insert",
        "userRef", "someuser",
        "datasetRef", "NnqVLwIyPn-nRkc",
        "record", DWCA_OCCURRENCE_RECORD
      )),
      ar -> {
        if (ar.succeeded()) {
          var body = ar.result().body();
          assertThat(body.getMap()).containsKeys("dateAdded", "dwcaId", "records");
          var dateAddedString = body.getString("dateAdded");
          assertThat(dateAddedString).isNotBlank();
          var dateAdded = Instant.parse(dateAddedString);
          var now = Instant.now();
          assertThat(now).isAfter(dateAdded);
          assertThat(Duration.between(dateAdded, now)).isLessThan(Duration.ofMillis(500));

          JsonObject records = body.getJsonObject("records");
          assertThat(records.getJsonArray(OCCURRENCE)).hasSize(1);
          assertThat(records.getJsonArray("emof")).hasSize(2);
          assertThat(records.getString("core")).isEqualTo(OCCURRENCE);

          testContext.completeNow();
        } else {
          error("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void findDwcaRecordsByName(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "dwca.record",
      new JsonObject(Map.of(
        "action", "find",
        "query", new JsonObject().put("user_ref", "FsfEMwhUTO_8I68")
      )),
      ar -> {
        if (ar.succeeded()) {
          JsonArray records = ar.result().body();
          assertThat(records).hasSize(2310);
          info(records.getJsonObject(0));
          records.stream()
            .map(JsonObject.class::cast)
            .forEach(record -> assertThat(record.getJsonObject("dwcRecords").containsKey("core")).isTrue());
          testContext.completeNow();
        } else {
          error("error {}", ar.cause());
          testContext.failNow(ar.cause());
        }
      });
  }
}
