package org.obis.smalldata.dataset;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

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
  void existsSuccess(Vertx vertx, VertxTestContext context) {
    vertx.eventBus().<Boolean>send(
      "datasets.exists",
      "PoJnGNMaxsupE4w",
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        assertThat(ar.result().body()).isTrue();
        context.completeNow();
      });
  }

  @Test
  void existsNonExistingDataset(Vertx vertx, VertxTestContext context) {
    vertx.eventBus().<Boolean>send(
      "datasets.exists",
      "unknown",
      ar -> {
        assertThat(ar.succeeded()).isTrue();
        assertThat(ar.result().body()).isFalse();
        context.completeNow();
      });
  }
}
