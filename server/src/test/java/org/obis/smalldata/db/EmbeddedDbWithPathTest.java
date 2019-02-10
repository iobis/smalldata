package org.obis.smalldata.db;

import com.fasterxml.uuid.Generators;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.pmw.tinylog.Logger;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(VertxExtension.class)
public class EmbeddedDbWithPathTest {
  private static final String COLLECTION_NAME = "someCollection";
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private static MongoClient client;
  private static File dbPath;

  @BeforeAll
  public static void beforeAll(Vertx vertx, VertxTestContext testContext) {
    File tmpDir = new File(System.getProperty("java.io.tmpdir") + File.separator + "obis-test");
    dbPath = new File(tmpDir.getAbsolutePath() + File.separator + "db-" + Generators.timeBasedGenerator().generate());
    vertx.deployVerticle(new EmbeddedDb(), new DeploymentOptions()
        .setConfig(new JsonObject()
          .put("bindIp", BIND_IP)
          .put("port", PORT)
          .put("path", dbPath.getAbsolutePath())),
      deployId -> {
        Logger.info("Deployed DB {}", deployId.result());
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

  @AfterAll
  public static void afterAll(Vertx vertx) {
    vertx.close(result -> {
      if (dbPath.exists()) {
        try {
          FileUtils.deleteDirectory(dbPath);
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    });
  }

  @Test
  @DisplayName("Check custom path")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void testCustomPath(Vertx vertx, VertxTestContext testContext) {
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
  @DisplayName("Insert data")
  @Timeout(value = 5, timeUnit = TimeUnit.SECONDS)
  public void step01Insert(Vertx vertx, VertxTestContext testContext) {
    client.insert(COLLECTION_NAME, new JsonObject().put("persistent", true),
      ar -> {
        if (ar.succeeded()) {
          Logger.info("result: {}", ar.result());
        } else {
          Logger.info("failed: {}", ar.cause());
        }
        testContext.completeNow();
      });
  }
}
