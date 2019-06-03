package org.obis.smalldata.testutil;

import com.google.common.base.Throwables;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.util.BulkOperationUtil;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

public class TestDb {
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private final JsonObject dbClientConfig = new JsonObject()
    .put("host", BIND_IP)
    .put("port", PORT);
  private MongodExecutable executable;
  private MongodProcess process;

  public MongoClient init(Vertx vertx) {
    try {
      MongodConfigBuilder mongodConfig = new MongodConfigBuilder()
        .net(new Net(BIND_IP, PORT, Network.localhostIsIPv6()))
        .version(Version.Main.PRODUCTION);
      executable = MongodStarter.getDefaultInstance().prepare(mongodConfig.build());
      process = executable.start();

      var mongoClient = MongoClient.createNonShared(vertx, dbClientConfig);
      var dwcaFuture = Future.<Long>future();
      mongoClient.bulkWrite(
        "dwcarecords",
        BulkOperationUtil.createInsertsFromFile("testdata/dwca/dwcarecords.json"),
        client -> dwcaFuture.complete(client.result().getInsertedCount()));
      dwcaFuture.setHandler(ar -> info("added {} dwca records", ar));
      var datasetFuture = Future.<Long>future();
      mongoClient.bulkWrite(
        "datasets",
        BulkOperationUtil.createInsertsFromFile("testdata/dwca/datasets.json"),
        client -> datasetFuture.complete(client.result().getInsertedCount()));
      datasetFuture.setHandler(ar -> info("added {} dwca records", ar));
      var usersFuture = Future.<Long>future();
      mongoClient.bulkWrite(
        "users",
        BulkOperationUtil.createInsertsFromFile("testdata/dwca/users.json"),
        client -> usersFuture.complete(client.result().getInsertedCount()));
      usersFuture.setHandler(res -> info("added {} users", res));

      var countDownLatch = new CountDownLatch(1);
      CompositeFuture.all(datasetFuture, dwcaFuture, usersFuture)
        .setHandler(ar -> {
          info(ar.result());
          countDownLatch.countDown();
        });
      if (!countDownLatch.await(2000, TimeUnit.MILLISECONDS)) {
        error("Cannot write data to database to setup tests");
        throw new InterruptedException("Cannot write data to database to setup tests");
      }
      info("MongoClient ready!");

      return mongoClient;
    } catch (InterruptedException | IOException e) {
      error(Throwables.getStackTraceAsString(e));
      return null;
    }
  }

  public void shutDown() {
    if (this.process != null) {
      process.stop();
      executable.stop();
    }
  }
}
