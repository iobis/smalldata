package org.obis.smalldata;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.AbstractVerticle;
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

@ExtendWith(VertxExtension.class)
public class TestEmbeddedDB {
  private static final MongodStarter starter = MongodStarter.getDefaultInstance();

  private MongodExecutable mongodExe;
  private MongodProcess mongod;
  private MongoClient client;

  @BeforeEach
  public void beforeEach(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(
      new AbstractVerticle() {
        @Override
        public void start() throws Exception {
          Logger.info("started dummy");
          String bindIp = "localhost";
          int port = 12345;
          mongodExe = starter.prepare(new MongodConfigBuilder()
            .version(Version.Main.PRODUCTION)
            .net(new Net(bindIp, port, Network.localhostIsIPv6()))
            .build());
          mongod = mongodExe.start();
          client = MongoClient.createNonShared(vertx,
            new JsonObject()
              .put("host", bindIp)
              .put("port", port));
          Logger.info("Running client {}", client);
        }
      },
      testContext.succeeding(id -> {
        Logger.info("succeeding {}", id);
        testContext.completeNow();
      }));
  }

  @AfterEach
  public void afterEach() {
    Logger.info("afterEach...");
    if (this.mongod != null) {
      this.mongod.stop();
      this.mongodExe.stop();
    }
  }

  @Test
  @DisplayName("Should create a new collection")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void shouldCreateNewObjectInEmbeddedMongoDb(Vertx vertx, VertxTestContext testContext) {
    Logger.info("-- Running test");
    client.createCollection(
      "testcollection",
      res -> {
        Logger.info("result: {}", res);
        testContext.completeNow();
      });
  }
}
