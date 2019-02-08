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
import org.pmw.tinylog.Logger;

import java.io.IOException;

public class StartDb extends AbstractVerticle {
  private static final MongodStarter starter = MongodStarter.getDefaultInstance();
  private MongodExecutable executable;
  private MongodProcess process;

  @Override
  public void start() throws IOException {
    Logger.info("Starting mongoDB with config {}", config());
    executable = starter.prepare(new MongodConfigBuilder()
      .version(Version.Main.PRODUCTION)
      .net(new Net(config().getString("bindIp", "localhost"),
        config().getInteger("port", 27017),
        Network.localhostIsIPv6()))
      .replication(new Storage(config().getString("path",null), null, 0))
      .build());
    process = executable.start();
  }

  @Override
  public void stop() {
    Logger.info("shutdown database");
    if (this.process != null) {
      this.process.stop();
      this.executable.stop();
    }
  }
}
