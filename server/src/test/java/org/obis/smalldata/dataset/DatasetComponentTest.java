package org.obis.smalldata.dataset;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DatasetComponentTest {

  private TestDb testDb;

  @BeforeEach
  void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);

    vertx.sharedData().getLocalMap("settings")
      .put("storage", new JsonObject()
        .put("host", "localhost")
        .put("port", 12345)
        .put("path", ""));
    vertx.deployVerticle(
      DatasetComponent.class.getName(),
      testContext.succeeding(id -> testContext.completeNow()));
  }

  @AfterEach
  public void stop() {
    info("shutdown mongo db");
    testDb.shutDown();
  }

  @Test
  @DisplayName("get all datasets")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void allDatasets(Vertx vertx, VertxTestContext testContext) {
    vertx.eventBus().<JsonArray>send("datasets.query", new JsonObject(),
      m -> {
        var datasets = m.result().body();
        assertThat(4)
          .isEqualTo(datasets.size());
        var refs = datasets.stream()
          .map(JsonObject.class::cast)
          .map(ds -> ds.getString("ref"))
          .collect(Collectors.toSet());
        assertThat(Set.of("NnqVLwIyPn-nRkc", "wEaBfmFyQhYCdsk", "ntDOtUc7XsRrIus", "PoJnGNMaxsupE4w"))
          .isEqualTo(refs);
        testContext.completeNow();
      });
  }

  @Test
  @DisplayName("get one dataset")
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  void oneDataset(Vertx vertx, VertxTestContext testContext) {
    var ref = "ntDOtUc7XsRrIus";
    vertx.eventBus().<JsonArray>send("datasets.query",
      new JsonObject().put("ref", ref),
      m -> {
        var datasets = m.result().body();
        info(datasets);
        assertThat(1)
          .isEqualTo(datasets.size());
        assertThat(datasets.getJsonObject(0).getString("ref"))
          .isEqualTo(ref);
        testContext.completeNow();
      });
  }

}
