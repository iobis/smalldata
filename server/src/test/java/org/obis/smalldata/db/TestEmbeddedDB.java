package org.obis.smalldata.db;

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
import org.pmw.tinylog.Logger;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(VertxExtension.class)
public class TestEmbeddedDB {
  private final String collection = "someCollection";
  private MongoClient client;

  @BeforeEach
  public void beforeEach(Vertx vertx, VertxTestContext testContext) {
    final String bindIp = "localhost";
    final int port = 12345;
    vertx.deployVerticle(new StartDb(), new DeploymentOptions()
        .setConfig(new JsonObject()
          .put("bindIp", bindIp)
          .put("port", port)),
      deployId -> {
        Logger.info("Deployed DB {}", deployId);
        client = MongoClient.createNonShared(vertx,
          new JsonObject()
            .put("host", bindIp)
            .put("port", port));
        Logger.info("Running client {}", client);
        client.createCollection(
          collection,
          res -> {
            client.insert(collection,
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

  @AfterEach
  public void afterEach() {

  }

  @Test
  @DisplayName("Should return at least one result")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void getAllDocs(Vertx vertx, VertxTestContext testContext) {
    client.find(collection,
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
  @DisplayName("Must find document matching the query")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void findDoc(Vertx vertx, VertxTestContext testContext) {
    client.find(collection,
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
