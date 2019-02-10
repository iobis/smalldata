package org.obis.smalldata.db;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.pmw.tinylog.Logger;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(VertxExtension.class)
public class EmbeddedDbTest {
  private static final String COLLECTION_NAME = "someCollection";
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private MongoClient client;

  @BeforeEach
  public void beforeEach(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(new EmbeddedDb(), new DeploymentOptions()
        .setConfig(new JsonObject()
          .put("bindIp", BIND_IP)
          .put("port", PORT)),
      deployId -> {
        Logger.info("Deployed DB {}", deployId);
        client = MongoClient.createNonShared(vertx,
          new JsonObject()
            .put("host", BIND_IP)
            .put("port", PORT));
        Logger.info("Running client {}", client);
        client.createCollection(
          COLLECTION_NAME,
          res -> {
            client.insert(COLLECTION_NAME,
              new JsonObject()
                .put("measurementID", 42)
                .put("measurementUnit", "m2"),
              testContext.succeeding(id -> {
                Logger.info("succeeding {}", id);
                testContext.completeNow();
              }));
          });
      });
  }

  @Test
  @DisplayName("returns at least one result")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void getAllDocs(Vertx vertx, VertxTestContext testContext) {
    client.find(COLLECTION_NAME,
      new JsonObject(),
      res -> {
        if (res.succeeded()) {
          Logger.info("result: {}", res.result());
          assertTrue(res.result().size() > 0);
        } else {
          Logger.info("failed: {}", res.cause());
        }
        testContext.completeNow();
      });
  }

  @Test
  @DisplayName("finds document matching the query")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void findDoc(Vertx vertx, VertxTestContext testContext) {
    client.find(COLLECTION_NAME,
      new JsonObject().put("measurementID", 42),
      res -> {
        if (res.succeeded()) {
          Logger.info("result: {}", res.result());
          assertTrue(res.result().size() > 0);
        } else {
          Logger.info("failes: {}", res.cause());
        }
        testContext.completeNow();
      });
  }
}
