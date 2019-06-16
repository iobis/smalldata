package org.obis.smalldata.dbcontroller;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.obis.smalldata.util.Collections;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class DbInitializerTest {

  private static final String BIND_IP = "localhost";
  private static final int PORT = 2357;

  private static MongoClient mongoClient;

  @BeforeAll
  public static void setUp(Vertx vertx, VertxTestContext testContext) {
    vertx.sharedData()
      .getLocalMap("settings").put("mode", "DEMO");
    vertx.deployVerticle(
      new StorageModule(),
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
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  public void checkBulkinessAllNewUsers(VertxTestContext testContext) {
    mongoClient.find(Collections.USERS.dbName(),
      new JsonObject(),
      ar -> {
        assertThat(ar.result())
          .allMatch(user -> user.containsKey("bulkiness"))
          .allMatch(user -> user.getInteger("bulkiness").equals(0));
        testContext.completeNow();
      });
  }

  @Test
  @Timeout(value = 2, timeUnit = TimeUnit.SECONDS)
  public void checkBulkinessExistingBulkiness(VertxTestContext testContext) throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(250);
    mongoClient.insert(Collections.USERS.dbName(),
      new JsonObject()
        .put("_ref", "someref")
        .put("bulkiness", 2.5),
      ar -> mongoClient.find(
        Collections.USERS.dbName(),
        new JsonObject(),
        arUsers -> {
          assertThat(arUsers.result())
            .allMatch(user -> user.containsKey("bulkiness"))
            .allMatch(user -> {
              if (user.getString("_ref").equals("someref")) {
                return user.getDouble("bulkiness").equals(2.5);
              } else {
                return user.getDouble("bulkiness").equals(0.0);
              }});
          testContext.completeNow();
        })
    );
  }
}
