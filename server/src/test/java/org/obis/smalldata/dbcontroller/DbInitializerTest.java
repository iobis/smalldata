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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.util.Collections;
import org.pmw.tinylog.Logger;

import java.time.Instant;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class DbInitializerTest {

  private static final String KEY_BULKINESS = "bulkiness";
  private static final String KEY_VALUE = "value";
  private static final String BIND_IP = "localhost";
  private static final int MONGO_MIN_PORT = 9999;

  private static MongoClient mongoClient;

  @BeforeEach
  public void setUp(Vertx vertx, VertxTestContext testContext) {
    vertx
      .sharedData()
      .getLocalMap("settings")
      .put("mode", "DEMO");
    var port = MONGO_MIN_PORT + new Random().nextInt(65535 - MONGO_MIN_PORT);
    vertx.deployVerticle(
      new StorageModule(),
      new DeploymentOptions().setConfig(MongoConfigs.ofServer(BIND_IP, port)),
      testContext.succeeding(deployId -> {
        mongoClient = MongoClient.createNonShared(vertx, MongoConfigs.ofClient(BIND_IP, port));
        testContext.completeNow();
      }));
  }

  @AfterEach
  public void tearDown() {
    mongoClient.close();
  }

  @Test
  @Timeout(value = 15, timeUnit = TimeUnit.SECONDS)
  public void checkBulkinessAllNewUsers(VertxTestContext testContext) throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(500);
    mongoClient.find(Collections.USERS.dbName(),
      new JsonObject(),
      ar -> {
        Logger.info(ar.result());
        assertThat(ar.result())
          .allMatch(user -> user.containsKey(KEY_BULKINESS))
          .allMatch(user -> {
            var bulkiness = user.getJsonObject(KEY_BULKINESS);
            return bulkiness.getDouble(KEY_VALUE).equals(0.0);
          });
        testContext.completeNow();
      });
  }

  @Test
  @Timeout(value = 15, timeUnit = TimeUnit.SECONDS)
  public void checkBulkinessExistingBulkiness(VertxTestContext testContext) throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(500);
    mongoClient.insert(Collections.USERS.dbName(),
      new JsonObject()
        .put("_ref", "someref")
        .put(KEY_BULKINESS, new JsonObject().put("instant", Instant.now()).put("value", 2.5)),
      ar -> mongoClient.find(
        Collections.USERS.dbName(),
        new JsonObject(),
        arUsers -> {
          assertThat(arUsers.result())
            .allMatch(user -> user.containsKey(KEY_BULKINESS))
            .allMatch(user -> {
              var bulkiness = user.getJsonObject(KEY_BULKINESS);
              if (user.getString("_ref").equals("someref")) {
                return bulkiness.getDouble(KEY_VALUE).equals(2.5);
              } else {
                return bulkiness.getDouble(KEY_VALUE).equals(0.0);
              }
            });
          testContext.completeNow();
        })
    );
  }
}
