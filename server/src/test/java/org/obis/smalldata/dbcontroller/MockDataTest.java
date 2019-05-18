package org.obis.smalldata.dbcontroller;

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
import org.obis.smalldata.util.BulkOperationUtil;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class MockDataTest {

  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private MongoClient mongoClient;

  @BeforeEach
  public void setUp(Vertx vertx, VertxTestContext testContext) {
    vertx.sharedData().getLocalMap("settings").put("mode", "TEST");
    vertx.deployVerticle(
      new EmbeddedDb(),
      new DeploymentOptions().setConfig(MongoConfigs.ofServer(BIND_IP, PORT)),
      testContext.succeeding(deployId -> {
        info("Deployed DB {}", deployId);
        mongoClient = MongoClient.createNonShared(vertx, MongoConfigs.ofClient(BIND_IP, PORT));
        info("Running mongoClient {}", mongoClient);
        testContext.completeNow();
      }));
  }

  @AfterEach
  public void tearDown() {
    mongoClient.close();
  }

  @Test
  @DisplayName("read mock data from json and add to dbcontroller")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void bulkWrite(VertxTestContext testContext) {
    var operations = BulkOperationUtil.createInsertsFromFile("testdata/testusers.json");
    Checkpoint checks = testContext.checkpoint(2);
    mongoClient.bulkWrite("users", operations,
      arClient -> {
        mongoClient.find("users", new JsonObject(), ar -> {
          assertThat(ar.result()).hasSize(2);
          checks.flag();
        });
        mongoClient.find("users", new JsonObject().put("lvl", 4), ar -> {
          assertThat(ar.result()).hasSize(1);
          checks.flag();
        });
      });
  }
}
