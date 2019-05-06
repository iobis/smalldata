package org.obis.smalldata.dwca;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.Checkpoint;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.testutil.TestDb;

import java.util.concurrent.TimeUnit;

import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class DwcaTest {

  private static TestDb testDb;

  @BeforeAll
  public static void deployVerticle(Vertx vertx, VertxTestContext testContext) {
    testDb = new TestDb();
    testDb.init(vertx);
    vertx.sharedData().getLocalMap("settings")
      .put("storage", new JsonObject()
        .put("host", "localhost")
        .put("port", 12345)
        .put("path", ""));
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
}
