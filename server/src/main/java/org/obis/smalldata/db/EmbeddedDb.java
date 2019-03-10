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

import java.io.IOException;

import static org.pmw.tinylog.Logger.info;

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
    var mongoConfig = new MongodConfigBuilder()
      .net(new Net(bindIp, port, Network.localhostIsIPv6()))
      .replication(new Storage(path, null, 0))
      .version(Version.Main.PRODUCTION)
      .build();
    executable = MONGOD_STARTER.prepare(mongoConfig);
    process = executable.start();
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
