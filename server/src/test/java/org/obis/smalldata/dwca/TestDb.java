package org.obis.smalldata.dwca;

import com.google.common.base.Throwables;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import org.obis.smalldata.dbcontroller.BulkOperationUtil;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;

class TestDb {
  private static final String BIND_IP = "localhost";
  private static final int PORT = 12345;

  private final JsonObject dbClientConfig = new JsonObject()
    .put("host", BIND_IP)
    .put("port", PORT);
  private MongodExecutable executable;
  private MongodProcess process;

  MongoClient init(Vertx vertx) {
    try {
      MongodConfigBuilder mongodConfig = new MongodConfigBuilder()
        .net(new Net(BIND_IP, PORT, Network.localhostIsIPv6()))
        .version(Version.Main.PRODUCTION);
      executable = MongodStarter.getDefaultInstance().prepare(mongodConfig.build());
      process = executable.start();
      var dwcaFuture = new CompletableFuture<Long>();
      var mongoClient = MongoClient.createNonShared(vertx, dbClientConfig);
      mongoClient.bulkWrite("dwcarecords",
        BulkOperationUtil.createOperationsFromFile("testdata/dwca/dwcarecords.json"),
        client -> dwcaFuture.complete(client.result().getInsertedCount()));
      info("added {} dwca records", dwcaFuture.get());
      var datasetFuture = new CompletableFuture<Long>();
      mongoClient.bulkWrite("datasets",
        BulkOperationUtil.createOperationsFromFile("testdata/dwca/datasets.json"),
        client -> datasetFuture.complete(client.result().getInsertedCount()));
      info("added {} datasets", datasetFuture.get());
      return mongoClient;
    } catch (InterruptedException | ExecutionException | IOException e) {
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
