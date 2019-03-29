package org.obis.smalldata.db;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.config.Storage;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

public class EmbeddedDb extends AbstractVerticle {
  private static final MongodStarter MONGOD_STARTER = MongodStarter.getDefaultInstance();
  private static final String BIND_IP_DEFAULT = "localhost";
  private static final int PORT_DEFAULT = 27017;

  private MongodExecutable executable;
  private MongodProcess process;

  @Override
  public void start() throws IOException {
    info("starting mongo db with config {}", config());
    var bindIp = config().getString("bindIp", BIND_IP_DEFAULT);
    var port = config().getInteger("port", PORT_DEFAULT);
    var path = config().getString("path", null);
    var mongodConfig = new MongodConfigBuilder()
      .net(new Net(bindIp, port, Network.localhostIsIPv6()))
      .version(Version.Main.PRODUCTION);

    if (path != null && !path.isEmpty() && Files.exists(Paths.get(path))) {
      mongodConfig.replication(new Storage(path, null, 0));
      info("Mongo started on path: {}", path);
    } else {
      warn("Mongo started without replication! Data is not stored between redeploys");
    }
    executable = MONGOD_STARTER.prepare(mongodConfig.build());
    process = executable.start();
    var dbInitializer = new DbInitializer(MongoClient.createNonShared(vertx,
      new JsonObject()
        .put("host", bindIp)
        .put("port", port)));
    dbInitializer.setupCollections();
    info("Starting application in {} mode",
      vertx.sharedData().getLocalMap("settings").get("mode"));
    var demomode = "DEMO";
    if (vertx.sharedData().getLocalMap("settings").get("mode") == null
      || demomode.equals(vertx.sharedData().getLocalMap("settings").get("mode"))) {
      dbInitializer.mockData();
    }
  }

  @Override
  public void stop() {
    info("shutdown mongo db");
    if (this.process != null) {
      this.process.stop();
      this.executable.stop();
    }
  }
}
