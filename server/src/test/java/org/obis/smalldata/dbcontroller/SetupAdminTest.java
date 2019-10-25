package org.obis.smalldata.dbcontroller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.pmw.tinylog.Logger.info;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.obis.smalldata.util.Collections;

@ExtendWith(VertxExtension.class)
public class SetupAdminTest {

  private static final String BIND_IP = "localhost";
  private static final int MONGO_MIN_PORT = 9999;

  @ParameterizedTest
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  @ValueSource(strings = {"kurt.sys@moment-4.be", "p.provoost@unesco.com"})
  public void createMainAdminInDemoMode(String email, Vertx vertx, VertxTestContext testContext) {
    vertx.sharedData().getLocalMap("settings").put("mode", "DEMO");
    var port = MONGO_MIN_PORT + new Random().nextInt(65535 - MONGO_MIN_PORT);
    vertx.deployVerticle(
        new StorageModule(),
        new DeploymentOptions()
            .setConfig(MongoConfigs.ofServer(BIND_IP, port).put("mainAdmin", email)),
        deployId -> {
          var mongoClient =
              MongoClient.createNonShared(vertx, MongoConfigs.ofClient(BIND_IP, port));
          mongoClient.findOne(
              Collections.USERS.dbName(),
              new JsonObject().put("emailAddress", email),
              new JsonObject(),
              ar -> {
                var admin = ar.result().getMap();
                info("Actual admin from the DB: {}", admin);
                assertThat(admin)
                    .containsKeys("_id", "_ref", "emailAddress", "role")
                    .containsEntry("emailAddress", email)
                    .containsEntry("role", "node manager");
                mongoClient.close();
                testContext.completeNow();
              });
        });
  }
}
