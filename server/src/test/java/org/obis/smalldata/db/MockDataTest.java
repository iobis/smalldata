package org.obis.smalldata.db;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Checkpoint;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class MockDataTest {

  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private MongoClient client;

  @BeforeEach
  public void beforeEach(Vertx vertx, VertxTestContext testContext) {
    vertx.sharedData().getLocalMap("settings").put("mode", "TEST");
    vertx.deployVerticle(new EmbeddedDb(), new DeploymentOptions()
        .setConfig(new JsonObject()
          .put("bindIp", BIND_IP)
          .put("port", PORT)),
      testContext.succeeding(deployId -> {
        info("Deployed DB {}", deployId);
        client = MongoClient.createNonShared(vertx,
          new JsonObject()
            .put("host", BIND_IP)
            .put("port", PORT));
        info("Running client {}", client);
        testContext.completeNow();
      }));
  }

  @Test
  @DisplayName("read mock data from json and add to db")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void bulkWrite(VertxTestContext testContext) {
    var operations = BulkOperationUtil.createOperationsFromFile("mockdata/testusers.json");
    Checkpoint checks = testContext.checkpoint(2);
    client.bulkWrite("users", operations,
      arClient -> {
        client.find("users", new JsonObject(), ar -> {
          assertEquals(ar.result().size(), 2);
          checks.flag();
        });
        client.find("users", new JsonObject().put("lvl", 4), ar -> {
          assertEquals(ar.result().size(), 1);
          checks.flag();
        });
      });
  }

  @AfterEach
  @DisplayName("Check that the verticle is still there")
  void lastChecks(Vertx vertx) {
    assertTrue(!vertx.deploymentIDs().isEmpty()
      && vertx.deploymentIDs().size() == 1);
  }
}
