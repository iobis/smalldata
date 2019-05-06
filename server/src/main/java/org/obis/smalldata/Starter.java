package org.obis.smalldata;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import org.obis.smalldata.auth.Auth;
import org.obis.smalldata.dataset.DatasetComponent;
import org.obis.smalldata.dbcontroller.EmbeddedDb;
import org.obis.smalldata.dwca.Dwca;
import org.obis.smalldata.rss.RssComponent;
import org.obis.smalldata.user.User;
import org.obis.smalldata.webapi.WebApi;

import static org.pmw.tinylog.Logger.debug;
import static org.pmw.tinylog.Logger.info;

public class Starter extends AbstractVerticle {

  private void deploy(Class verticleClass, String configKey) {
    vertx.deployVerticle(verticleClass.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject(configKey)));
  }

  @Override
  public void start(Future<Void> startFuture) {
    debug("starting the application with config: {}", config().encodePrettily());
    vertx.sharedData().getLocalMap("settings")
      .put("mode", config().getValue("mode", "DEV"));
    vertx.sharedData().getLocalMap("settings")
      .put("storage", config().getJsonObject("storage",
        new JsonObject()
          .put("bindIp", "localhost")
          .put("port", 27017)
          .put("path", "")));
    vertx.deployVerticle(EmbeddedDb.class.getName(),
      new DeploymentOptions().setConfig(config().getJsonObject("storage")),
      deployHandler -> {
        info("Deployed Embedded DB verticle {}", deployHandler.result());
        deploy(User.class, "user");
        deploy(Dwca.class, "dwca");
        deploy(RssComponent.class, "rss");
        deploy(WebApi.class, "http");
        deploy(Auth.class, "auth");
        deploy(DatasetComponent.class, "dataset");
      });
  }
}
