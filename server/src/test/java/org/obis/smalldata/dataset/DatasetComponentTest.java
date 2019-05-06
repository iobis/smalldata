package org.obis.smalldata.dataset;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DatasetComponentTest {

  private static TestDb testDb;

  @BeforeAll
  public static void setUp(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);
    vertx.sharedData()
      .getLocalMap("settings")
      .put("storage", new JsonObject()
        .put("host", "localhost")
        .put("port", 12345)
        .put("path", ""));
    vertx.deployVerticle(
      DatasetComponent.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterAll
  public static void tearDown() {
    info("shutdown mongo db");
    testDb.shutDown();
  }

  @Test
  void getAllDataSets(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "datasets.query",
      new JsonObject(),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(4);
        var refs = datasets.stream()
          .map(JsonObject.class::cast)
          .map(jsonObject -> jsonObject.getString(DatasetComponent.QUERY_REF))
          .collect(Collectors.toSet());
        assertThat(refs).containsExactlyInAnyOrder("NnqVLwIyPn-nRkc", "wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w");
        testContext.completeNow();
      });
  }

  @Test
  void getOneDataset(Vertx vertx, VertxTestContext testContext) {
    var ref = "ntDOtUc7XsRrIus";
    vertx.eventBus().<JsonArray>send(
      "datasets.query",
      new JsonObject().put(DatasetComponent.QUERY_REF, ref),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(1);
        assertThat(datasets.getJsonObject(0).getString(DatasetComponent.QUERY_REF)).isEqualTo(ref);
        testContext.completeNow();
      });
  }

  @Test
  void getNotAvailableDataset(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send(
      "datasets.query",
      new JsonObject().put(DatasetComponent.QUERY_REF, "unknown"),
      ar -> {
        var datasets = ar.result().body();
        assertThat(datasets).hasSize(0);
        testContext.completeNow();
      });
  }
}
