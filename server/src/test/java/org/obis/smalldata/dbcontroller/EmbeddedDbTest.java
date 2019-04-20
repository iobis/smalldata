package org.obis.smalldata.dbcontroller;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

@ExtendWith(VertxExtension.class)
public class EmbeddedDbTest {
  private static final String COLLECTION_NAME = "someCollection";
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private MongoClient mongoClient;

  @BeforeEach
  public void setUp(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new EmbeddedDb(),
      new DeploymentOptions().setConfig(MongoConfigs.ofServer(BIND_IP, PORT)),
      deployId -> {
        info("Deployed DB {}", deployId);
        mongoClient = MongoClient.createNonShared(vertx, MongoConfigs.ofClient(BIND_IP, PORT));
        info("Running mongoClient {}", mongoClient);
        mongoClient.createCollection(
          COLLECTION_NAME,
          res -> mongoClient
            .insert(COLLECTION_NAME,
              new JsonObject()
                .put("measurementID", 42)
                .put("measurementUnit", "m2"),
              testContext.succeeding(id -> {
                info("succeeding {}", id);
                testContext.completeNow();
              })));
      });
  }

  @AfterEach
  public void tearDown() {
    mongoClient.close();
  }

  @Test
  @DisplayName("returns at least one result")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void findReturnsAtLeastOneResult(VertxTestContext testContext) {
    mongoClient.find(
      COLLECTION_NAME,
      new JsonObject(),
      result -> {
        info("result: {}", result.result());
        assertThat(result.succeeded()).isTrue();
        assertThat(result.result()).isNotEmpty();
        testContext.completeNow();
      });
  }

  @Test
  @DisplayName("finds document matching the query")
  @Timeout(value = 10, timeUnit = TimeUnit.SECONDS)
  public void findDoc(VertxTestContext testContext) {
    mongoClient.find(
      COLLECTION_NAME,
      new JsonObject().put("measurementID", 42),
      result -> {
        info("result: {}", result.result());
        assertThat(result.succeeded()).isTrue();
        assertThat(result.result()).isNotEmpty();
        testContext.completeNow();
      });
  }
}
