package org.obis.smalldata.dataset;

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

import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class DatasetActionHandlerTest {

  private static final String KEY_ACTION = "action";
  private static final String QUERY_REF = "ref";
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
      DatasetComponent.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterEach
  public void stop() {
    testDb.shutDown();
  }

  @Test
  void getAllDataSets(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "datasets",
      new JsonObject()
        .put(KEY_ACTION, "find")
        .put("query", new JsonObject()),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(4);
        var refs = datasets.stream()
          .map(JsonObject.class::cast)
          .map(jsonObject -> jsonObject.getString(QUERY_REF))
          .collect(Collectors.toSet());
        assertThat(refs).containsExactlyInAnyOrder("NnqVLwIyPn-nRkc", "wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w");
        testContext.completeNow();
      });
  }

  @Test
  void getOneDataset(Vertx vertx, VertxTestContext testContext) {
    var ref = "ntDOtUc7XsRrIus";
    vertx.eventBus().<JsonArray>send(
      "datasets",
      new JsonObject().put(KEY_ACTION, "find")
        .put("query", new JsonObject().put(QUERY_REF, ref)),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(1);
        assertThat(datasets.getJsonObject(0).getString(QUERY_REF)).isEqualTo(ref);
        testContext.completeNow();
      });
  }

  @Test
  void getNotAvailableDataset(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "datasets",
      new JsonObject().put(KEY_ACTION, "find")
        .put("query", new JsonObject().put(QUERY_REF, "unknown")),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(0);
        testContext.completeNow();
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void insertDataset(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      Collections.DATASETS.dbName(),
      new JsonObject(Map.of(
        KEY_ACTION, "insert",
        "dataset", new JsonObject().put("key", 42))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json.getString("_ref")).hasSize(15);
          assertThat(json.getInteger("key")).isEqualTo(42);
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void replaceDataset(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonObject>send(
      Collections.DATASETS.dbName(),
      new JsonObject(Map.of(
        KEY_ACTION, "replace",
        "datasetRef", "PoJnGNMaxsupE4w",
        "dataset", new JsonObject().put("universe_key", 42))),
      ar -> {
        if (ar.succeeded()) {
          assertThat(ar.succeeded()).isTrue();
          var json = ar.result().body();
          assertThat(json.getString("_ref")).hasSize(15);
          assertThat(json.getInteger("universe_key")).isEqualTo(42);
          testContext.completeNow();
        } else {
          testContext.failNow(ar.cause());
        }
      });
  }
}
