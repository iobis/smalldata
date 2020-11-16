package org.obis.smalldata.dbcontroller;

import static org.pmw.tinylog.Logger.error;
import static org.pmw.tinylog.Logger.info;
import static org.pmw.tinylog.Logger.warn;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongoCmdOptionsBuilder;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.config.Storage;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.ext.mongo.MongoClient;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class StorageModule extends AbstractVerticle {
  private static final MongodStarter MONGOD_STARTER = MongodStarter.getDefaultInstance();
  private static final String BIND_IP_DEFAULT = "localhost";
  private static final String HOST_DEFAULT = "localhost";
  private static final int PORT_DEFAULT = 27017;
  private static final int SYNCDELAY_DEFAULT = 60;
  private static final String DEMO_MODE = "DEMO";

  private MongodExecutable executable;
  private MongodProcess process;

  @Override
  public void start(Future<Void> done) {
    info("starting mongo db with config {}", config());
    var bindIp = config().getString("bindIp", BIND_IP_DEFAULT);
    var host = config().getString("host", BIND_IP_DEFAULT);
    var port = config().getInteger("port", PORT_DEFAULT);
    var syncDelay = config().getInteger("syncDelay", SYNCDELAY_DEFAULT);
    var path = config().getString("path", "");
    var mainAdmin = config().getString("mainAdmin");
    try {
      var mongodConfig =
          new MongodConfigBuilder()
              .net(new Net(bindIp, port, Network.localhostIsIPv6()))
              .cmdOptions(new MongoCmdOptionsBuilder().syncDelay(syncDelay).build())
              .version(Version.Main.PRODUCTION);

      if (!path.isEmpty() && Files.exists(Paths.get(path))) {
        mongodConfig.replication(new Storage(path, null, 0));
        info("Mongo started on path: {}", path);
      } else {
        warn("Mongo started without replication! Data is not stored between redeploys");
      }
      executable = MONGOD_STARTER.prepare(mongodConfig.build());
      process = executable.start();
    } catch (IOException e) {
      error(e.getMessage());
      vertx.close(
          closeHandler -> {
            error("could not start mongodb");
            info(closeHandler.result());
          });
    }
    var dbInitializer =
        new DbInitializer(MongoClient.createNonShared(vertx, MongoConfigs.ofClient(host, port)));
    dbInitializer
        .setupCollections()
        .setHandler(
            arCollections -> {
              if (isDemoMode(vertx)) {
                dbInitializer
                    .mockData()
                    .setHandler(arMock -> completeDone(done, dbInitializer, mainAdmin));
              } else {
                completeDone(done, dbInitializer, mainAdmin);
              }
            });
  }

  private void completeDone(Future<Void> done, DbInitializer dbInitializer, String mainAdmin) {
    CompositeFuture.all(
            initializeBulkiness(dbInitializer), initializeNodeAdmins(dbInitializer, mainAdmin))
        .setHandler(
            inits -> {
              if (inits.failed()) {
                error(inits.cause());
              }
              done.complete();
            });
  }

  private Future<Void> initializeBulkiness(DbInitializer dbInitializer) {
    var done = Future.<Void>future();
    dbInitializer
        .initBulkiness()
        .setHandler(
            ar -> {
              if (ar.result()) {
                done.complete();
              } else {
                done.fail("Cannot initialize bulkiness");
              }
            });
    return done;
  }

  private Future<Void> initializeNodeAdmins(DbInitializer dbInitializer, String mainAdmin) {
    return dbInitializer.updateAdmin(mainAdmin);
  }

  @Override
  public void stop() {
    info("shutdown mongo dbcontroller");
    if (this.process != null) {
      process.stop();
      executable.stop();
    }
  }

  private boolean isDemoMode(Vertx vertx) {
    var mode = vertx.sharedData().getLocalMap("settings").get("mode");
    info("Starting application in {} mode", mode);
    return mode == null || DEMO_MODE.equals(mode);
  }
}
