package org.obis.smalldata.db;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(VertxExtension.class)
public class DemoModeTest {
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private static MongoClient mongoClient;

  @BeforeAll
  public static void setUp(Vertx vertx, VertxTestContext testContext) {
    vertx.sharedData()
      .getLocalMap("settings").put("mode", "DEMO");
    vertx.deployVerticle(
      new EmbeddedDb(),
      new DeploymentOptions().setConfig(MongoConfigs.ofServer(BIND_IP, PORT)),
      testContext.succeeding(deployId -> {
        mongoClient = MongoClient.createNonShared(vertx, MongoConfigs.ofClient(BIND_IP, PORT));
        testContext.completeNow();
      }));
  }

  @AfterAll
  public static void tearDown() {
    mongoClient.close();
  }

  @Test
  @DisplayName("read default mock data")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  void findData(VertxTestContext testContext) throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(1000);
    mongoClient.find(
      Collections.DATASETS.dbName(),
      new JsonObject().put("meta.type", "event"),
      ar -> {
        assertEquals(1, ar.result().size());
        testContext.completeNow();
      });
  }
}
