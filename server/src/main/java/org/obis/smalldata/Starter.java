package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import org.obis.smalldata.db.EmbeddedDb;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.webapi.WebApi;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  @Override
  public void start(Future<Void> startFuture) {
    debug("starting the application with config: {}", config().encodePrettily());
    vertx.sharedData().getLocalMap("settings").put("mode", config().getValue("mode", "DEV"));
    vertx.deployVerticle(WebApi.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("http")));
    vertx.deployVerticle(RssComponent.class.getName());
    vertx.deployVerticle(EmbeddedDb.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")));
  }
}
